import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../services/NotificationService';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { tripstyle } from "../styles/Tripcss";

const NotificationScreen = () => {
    const nav = useNavigation();
    const state = useNavigationState((state) => state);
    const currentRoute = state.routes[state.index].name;

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [driverId, setDriverId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        initializeScreen();
        
        const handleNotification = (data) => {
            console.log('Notification received:', data);
            
            if (data.type === 'foreground_message') {
                Alert.alert(
                    'New Notification',
                    `${data.title}\n${data.body}`,
                    [
                        {
                            text: 'View',
                            onPress: () => fetchNotifications()
                        },
                        {
                            text: 'Dismiss',
                            style: 'cancel'
                        }
                    ]
                );
            }
        };
        
        NotificationService.addListener(handleNotification);
        
        return () => {
            NotificationService.removeListener(handleNotification);
        };
    }, []);

    const initializeScreen = async () => {
        try {
            const session = await AsyncStorage.getItem('userSession');
            if (session) {
                const sessionData = JSON.parse(session);
                setDriverId(sessionData.userId);
                
                await NotificationService.initialize();
                await NotificationService.registerTokenWithBackend(sessionData.userId);
                await fetchNotifications(sessionData.userId);
            }
        } catch (error) {
            console.error('Error initializing notifications:', error);
            Alert.alert('Error', 'Failed to initialize notifications');
        }
    };

    const fetchNotifications = async (userId = driverId) => {
        if (!userId) return;
        
        setLoading(true);
        try {
            const result = await NotificationService.getNotifications(userId);
            setNotifications(result.notifications);
            setUnreadCount(result.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            Alert.alert('Error', 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const markAsRead = async (notificationId) => {
        if (!driverId) return;
        
        try {
            const success = await NotificationService.markAsRead(notificationId, driverId);
            if (success) {
                setNotifications(prev => 
                    prev.map(notif => 
                        notif.notification_id === notificationId 
                            ? { ...notif, is_read: 1 }
                            : notif
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!driverId || unreadCount === 0) return;
        
        Alert.alert(
            'Mark All as Read',
            'Mark all notifications as read?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Mark All',
                    onPress: async () => {
                        try {
                            const unreadNotifications = notifications.filter(n => n.is_read == 0);
                            for (const notif of unreadNotifications) {
                                await NotificationService.markAsRead(notif.notification_id, driverId);
                            }
                            await fetchNotifications();
                        } catch (error) {
                            console.error('Error marking all as read:', error);
                            Alert.alert('Error', 'Failed to mark all as read');
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'trip_assigned': return '🚛';
            case 'trip_updated': return '📝';
            case 'trip_cancelled': return '❌';
            case 'trip_status_change': return '📊';
            case 'payment_confirmed': return '💰';
            case 'system_update': return '🔔';
            default: return '📱';
        }
    };

    const getPriorityColor = (type) => {
        if (type === 'trip_assigned' || type === 'trip_cancelled') return '#FF6B35';
        if (type === 'payment_confirmed') return '#4CAF50';
        return '#999';
    };

    const getFilteredNotifications = () => {
        if (activeTab === 'Unread') {
            return notifications.filter(n => n.is_read == 0);
        }
        if (activeTab === 'Read') {
            return notifications.filter(n => n.is_read == 1);
        }
        return notifications;
    };

    const filteredNotifications = getFilteredNotifications();

    if (loading && notifications.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#a62626ff" />
                    <Text style={styles.loadingText}>Loading notifications...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                            <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                {/* Filter Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'All' && styles.activeTab]}
                        onPress={() => setActiveTab('All')}
                    >
                        <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Unread' && styles.activeTab]}
                        onPress={() => setActiveTab('Unread')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Unread' && styles.activeTabText]}>
                            Unread
                        </Text>
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Read' && styles.activeTab]}
                        onPress={() => setActiveTab('Read')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Read' && styles.activeTabText]}>
                            Read
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Notifications List */}
            <ScrollView
                style={styles.notificationsList}
                contentContainerStyle={styles.notificationsContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        colors={['#a62626ff']}
                        tintColor="#a62626ff"
                    />
                }
            >
                {filteredNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>
                            {activeTab === 'Unread' ? '✅' : activeTab === 'Read' ? '📭' : '📪'}
                        </Text>
                        <Text style={styles.emptyStateText}>
                            {activeTab === 'Unread' 
                                ? 'No unread notifications' 
                                : activeTab === 'Read'
                                ? 'No read notifications'
                                : 'No notifications yet'}
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            {activeTab === 'All' 
                                ? 'New notifications will appear here'
                                : 'Pull down to refresh'}
                        </Text>
                    </View>
                ) : (
                    filteredNotifications.map((notification, index) => (
                        <TouchableOpacity
                            key={notification.notification_id || index}
                            style={[
                                styles.notificationItem,
                                notification.is_read == 0 && styles.unreadNotification
                            ]}
                            onPress={() => {
                                if (notification.is_read == 0) {
                                    markAsRead(notification.notification_id);
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.notificationContent}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.notificationIcon}>
                                        {getNotificationIcon(notification.type)}
                                    </Text>
                                </View>
                                
                                <View style={styles.textContainer}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.notificationTitle} numberOfLines={1}>
                                            {notification.title}
                                        </Text>
                                        {notification.is_read == 0 && (
                                            <View style={styles.unreadDot} />
                                        )}
                                    </View>
                                    
                                    <Text style={styles.notificationBody} numberOfLines={2}>
                                        {notification.body}
                                    </Text>
                                    
                                    {notification.trip_id && (
                                        <View style={styles.tripInfoContainer}>
                                            <Text style={styles.tripInfoText} numberOfLines={1}>
                                                Trip #{notification.trip_id}
                                                {notification.destination && ` • ${notification.destination}`}
                                            </Text>
                                        </View>
                                    )}
                                    
                                    <View style={styles.metaRow}>
                                        <Text style={styles.timeText}>
                                            {formatDate(notification.created_at)}
                                        </Text>
                                        <View style={[styles.priorityBadge, { 
                                            backgroundColor: `${getPriorityColor(notification.type)}15` 
                                        }]}>
                                            <Text style={[styles.priorityText, { 
                                                color: getPriorityColor(notification.type) 
                                            }]}>
                                                {notification.type.replace('_', ' ')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <View style={tripstyle.bottomNav}>
                            <TouchableOpacity
                                style={[tripstyle.navButton, currentRoute === "Dashboard" && tripstyle.navButtonActive]}
                                onPress={() => nav.navigate("Dashboard")}
                            >
                                <View style={tripstyle.navIconContainer}>
                                    <Image
                                        source={require("../assets/Home.png")}
                                        style={[
                                            tripstyle.navIcon,
                                            { tintColor: currentRoute === "Dashboard" ? "#dc2626" : "#9ca3af" }
                                        ]}
                                    />
                                </View>
                                <Text
                                    style={[
                                        tripstyle.navLabel,
                                        { color: currentRoute === "Dashboard" ? "#dc2626" : "#9ca3af" }
                                    ]}
                                >
                                    Home
                                </Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity
                                style={[tripstyle.navButton, currentRoute === "Notifications" && tripstyle.navButtonActive]}
                                onPress={() => nav.navigate("Notifications")}
                            >
                                <View style={tripstyle.navIconContainer}>
                                <Image
                                    source={require("../assets/bell.png")}
                                    style={[tripstyle.navIcon, { 
                                    tintColor: currentRoute === "Notifications" ? "#dc2626" : "#9ca3af" 
                                }]}
                                />
                                    {unreadCount > 0 && (
                                        <View style={tripstyle.navBadge}>
                                            <Text style={tripstyle.navBadgeText}>
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                             </Text>
                                        </View>
                                    )}
                                        </View>
                                    <Text style={[tripstyle.navLabel, { 
                                    color: currentRoute === "Notifications" ? "#dc2626" : "#9ca3af" 
                                        }]}>
                                Notifications
                                </Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity
                                style={[tripstyle.navButton, currentRoute === "Trips" && tripstyle.navButtonActive]}
                                onPress={() => nav.navigate("Trips")}
                            >
                                <View style={tripstyle.navIconContainer}>
                                    <Image
                                        source={require("../assets/location2.png")}
                                        style={[
                                            tripstyle.navIcon,
                                            { tintColor: currentRoute === "Trips" ? "#dc2626" : "#9ca3af" }
                                        ]}
                                    />
                                </View>
                                <Text
                                    style={[
                                        tripstyle.navLabel,
                                        { color: currentRoute === "Trips" ? "#dc2626" : "#9ca3af" }
                                    ]}
                                >
                                    Trips
                                </Text>
                            </TouchableOpacity>
            
                            <TouchableOpacity
                                style={[tripstyle.navButton, currentRoute === "Profile" && tripstyle.navButtonActive]}
                                onPress={() => nav.navigate("Profile")}
                            >
                                <View style={tripstyle.navIconContainer}>
                                    <Image
                                        source={require("../assets/user.png")}
                                        style={[
                                            tripstyle.navIcon,
                                            { tintColor: currentRoute === "Profile" ? "#dc2626" : "#9ca3af" }
                                        ]}
                                    />
                                </View>
                                <Text
                                    style={[
                                        tripstyle.navLabel,
                                        { color: currentRoute === "Profile" ? "#dc2626" : "#9ca3af" }
                                    ]}
                                >
                                    Profile
                                </Text>
                            </TouchableOpacity>
                        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFB',
    },
    header: {
        backgroundColor: '#7a0f0fff',
        paddingTop: 50,
        paddingBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    markAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    markAllText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#7a0f0fff',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#fff',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.7)',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '700',
    },
    unreadBadge: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
        minWidth: 20,
        alignItems: 'center',
    },
    unreadBadgeText: {
        color: '#d32f2f',
        fontSize: 11,
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    notificationsList: {
        flex: 1,
    },
    notificationsContent: {
        paddingVertical: 10,
    },
    emptyState: {
        paddingVertical: 80,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 15,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
    notificationItem: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    unreadNotification: {
        borderLeftWidth: 4,
        borderLeftColor: '#d32f2f',
        backgroundColor: '#fffbf5',
    },
    notificationContent: {
        flexDirection: 'row',
        padding: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationIcon: {
        fontSize: 22,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#d32f2f',
        marginLeft: 8,
    },
    notificationBody: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 8,
    },
    tripInfoContainer: {
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    tripInfoText: {
        fontSize: 12,
        color: '#0369a1',
        fontWeight: '600',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    bottomNav: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    navButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    navIconContainer: {
        position: 'relative',
        marginBottom: 4,
    },
    navIcon: {
        width: 24,
        height: 24,
    },
    navBadge: {
        position: 'absolute',
        top: -6,
        right: -10,
        backgroundColor: '#dc2626',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    navBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    navLabel: {
        fontSize: 12,
        fontWeight: "500",
    },
    navButtonActive: {
        borderTopWidth: 2,
        borderTopColor: "#dc2626",
    },
});

export default NotificationScreen;