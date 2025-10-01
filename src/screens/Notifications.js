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
    Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../services/NotificationService';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { tripstyle } from "../styles/Tripcss";
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

    const handleNotificationPress = async (notification) => {
        if (notification.is_read == 0) {
            await markAsRead(notification.notification_id);
        }

        if (notification.trip_id) {
            nav.navigate('Trips', { 
                tripId: notification.trip_id,
                highlightTrip: true 
            });
        } else {
            nav.navigate('Trips');
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
            case 'trip_assigned':
                return { name: 'truck-fast', library: 'MaterialCommunityIcons', color: '#FF6B35' };
            case 'trip_updated':
                return { name: 'file-document-edit', library: 'MaterialCommunityIcons', color: '#2196F3' };
            case 'trip_cancelled':
                return { name: 'close-circle', library: 'MaterialCommunityIcons', color: '#F44336' };
            case 'trip_status_change':
                return { name: 'chart-line', library: 'MaterialCommunityIcons', color: '#9C27B0' };
            case 'payment_confirmed':
                return { name: 'cash-check', library: 'MaterialCommunityIcons', color: '#4CAF50' };
            case 'system_update':
                return { name: 'bell-ring', library: 'MaterialCommunityIcons', color: '#FF9800' };
            default:
                return { name: 'notifications', library: 'Ionicons', color: '#607D8B' };
        }
    };

    const getPriorityColor = (type) => {
        if (type === 'trip_assigned' || type === 'trip_cancelled') return '#FF6B35';
        if (type === 'payment_confirmed') return '#4CAF50';
        if (type === 'trip_updated') return '#2196F3';
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

    const renderIcon = (iconData) => {
        const IconComponent = iconData.library === 'MaterialCommunityIcons' 
            ? MaterialCommunityIcons 
            : Ionicons;
        
        return (
            <IconComponent 
                name={iconData.name} 
                size={24} 
                color={iconData.color} 
            />
        );
    };

    const filteredNotifications = getFilteredNotifications();

    if (loading && notifications.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.headerTitleContainer}>
                            <Ionicons name="notifications" size={28} color="#fff" />
                            <Text style={styles.headerTitle}>Notifications</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#d32f2f" />
                    <Text style={styles.loadingText}>Loading notifications...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Notifications</Text>
                    </View>
                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                            <Icon name="check-circle" size={16} color="#fff" style={styles.markAllIcon} />
                            <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'All' && styles.activeTab]}
                        onPress={() => setActiveTab('All')}
                    >
                        <Icon 
                            name="inbox" 
                            size={16} 
                            color={activeTab === 'All' ? '#fff' : 'rgba(255,255,255,0.7)'} 
                            style={styles.tabIcon}
                        />
                        <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Unread' && styles.activeTab]}
                        onPress={() => setActiveTab('Unread')}
                    >
                        <Icon 
                            name="mail" 
                            size={16} 
                            color={activeTab === 'Unread' ? '#fff' : 'rgba(255,255,255,0.7)'} 
                            style={styles.tabIcon}
                        />
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
                        <Icon 
                            name="check-square" 
                            size={16} 
                            color={activeTab === 'Read' ? '#fff' : 'rgba(255,255,255,0.7)'} 
                            style={styles.tabIcon}
                        />
                        <Text style={[styles.tabText, activeTab === 'Read' && styles.activeTabText]}>
                            Read
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView
                style={styles.notificationsList}
                contentContainerStyle={[
                    styles.notificationsContent,
                    { paddingBottom: 80 }
                ]}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        colors={['#d32f2f']}
                        tintColor="#d32f2f"
                    />
                }
            >
                {filteredNotifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyStateIconContainer}>
                            {activeTab === 'Unread' ? (
                                <Ionicons name="checkmark-done-circle" size={80} color="#4CAF50" />
                            ) : activeTab === 'Read' ? (
                                <MaterialCommunityIcons name="email-open" size={80} color="#9E9E9E" />
                            ) : (
                                <Ionicons name="notifications-off" size={80} color="#BDBDBD" />
                            )}
                        </View>
                        <Text style={styles.emptyStateText}>
                            {activeTab === 'Unread' 
                                ? 'All caught up!' 
                                : activeTab === 'Read'
                                ? 'No read notifications'
                                : 'No notifications yet'}
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            {activeTab === 'Unread' 
                                ? 'You have no unread notifications' 
                                : activeTab === 'All' 
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
                            onPress={() => handleNotificationPress(notification)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.notificationContent}>
                                <View style={[
                                    styles.iconContainer,
                                    { backgroundColor: `${getNotificationIcon(notification.type).color}15` }
                                ]}>
                                    {renderIcon(getNotificationIcon(notification.type))}
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
                                    
                                    <View style={styles.metaRow}>
                                        <Text style={styles.timeText}>
                                            {formatDate(notification.created_at)}
                                        </Text>
                                        <Icon 
                                            name="chevron-right" 
                                            size={16} 
                                            color="#999" 
                                            style={styles.chevronIcon}
                                        />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={tripstyle.bottomNav}>
                <TouchableOpacity
                    style={[tripstyle.navButton, currentRoute === "Dashboard" && tripstyle.navButtonActive]}
                    onPress={() => nav.navigate("Dashboard")}
                >
                    <View style={tripstyle.navIconContainer}>
                        <Icon 
                            name="home" 
                            size={24} 
                            color={currentRoute === "Dashboard" ? "#dc2626" : "#6B7280"} 
                        />
                    </View>
                    <Text style={[tripstyle.navLabel, { color: currentRoute === "Dashboard" ? "#dc2626" : "#6B7280" }]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[tripstyle.navButton, currentRoute === "Notifications" && tripstyle.navButtonActive]}
                    onPress={() => nav.navigate("Notifications")}
                >
                    <View style={tripstyle.navIconContainer}>
                        <Icon 
                            name="bell" 
                            size={24} 
                            color={currentRoute === "Notifications" ? "#dc2626" : "#6B7280"} 
                        />
                        {unreadCount > 0 && (
                            <View style={tripstyle.navBadge}>
                                <Text style={tripstyle.navBadgeText}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={[tripstyle.navLabel, { color: currentRoute === "Notifications" ? "#dc2626" : "#6B7280" }]}>
                        Notifications
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[tripstyle.navButton, currentRoute === "Trips" && tripstyle.navButtonActive]}
                    onPress={() => nav.navigate("Trips")}
                >
                    <View style={tripstyle.navIconContainer}>
                        <Icon 
                            name="map-pin" 
                            size={24} 
                            color={currentRoute === "Trips" ? "#dc2626" : "#6B7280"} 
                        />
                    </View>
                    <Text style={[tripstyle.navLabel, { color: currentRoute === "Trips" ? "#dc2626" : "#6B7280" }]}>
                        Trips
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[tripstyle.navButton, currentRoute === "Profile" && tripstyle.navButtonActive]}
                    onPress={() => nav.navigate("Profile")}
                >
                    <View style={tripstyle.navIconContainer}>
                        <Icon 
                            name="user" 
                            size={24} 
                            color={currentRoute === "Profile" ? "#dc2626" : "#6B7280"} 
                        />
                    </View>
                    <Text style={[tripstyle.navLabel, { color: currentRoute === "Profile" ? "#dc2626" : "#6B7280" }]}>
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
        backgroundColor: '#F5F7FA',
    },
    header: {
        backgroundColor: '#7a0f0fff',
        paddingTop: 10,
        paddingBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        gap: 6,
    },
    markAllIcon: {
        marginRight: 2,
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
        gap: 6,
    },
    activeTab: {
        borderBottomColor: '#fff',
    },
    tabIcon: {
        marginRight: 2,
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '700',
    },
    unreadBadge: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginLeft: 6,
        minWidth: 22,
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
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    notificationsList: {
        flex: 1,
    },
    notificationsContent: {
        paddingVertical: 12,
    },
    emptyState: {
        paddingVertical: 100,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyStateIconContainer: {
        marginBottom: 24,
        opacity: 0.8,
    },
    emptyStateText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 15,
        color: '#757575',
        textAlign: 'center',
        lineHeight: 22,
    },
    notificationItem: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    unreadNotification: {
        borderLeftWidth: 5,
        borderLeftColor: '#d32f2f',
        backgroundColor: '#FFFBF5',
        borderColor: '#FFE5E5',
    },
    notificationContent: {
        flexDirection: 'row',
        padding: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: 0.2,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#d32f2f',
        marginLeft: 8,
    },
    notificationBody: {
        fontSize: 14,
        color: '#4A4A4A',
        lineHeight: 20,
        marginBottom: 10,
    },
    tripInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'flex-start',
        gap: 6,
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
        fontWeight: '500',
    },
    chevronIcon: {
        marginLeft: 'auto',
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'capitalize',
        letterSpacing: 0.3,
    },
});

export default NotificationScreen;