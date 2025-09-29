import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    Image,
    Switch,
    TouchableOpacity,
    Alert,
    ScrollView,
    AppState,
} from "react-native";
import { useNavigation, useNavigationState, useFocusEffect } from "@react-navigation/native";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dashboardstyles } from "../styles/dashboardcss";
import { tripstyle } from "../styles/Tripcss";
import LocationService from "../services/LocationService";
import DashboardSkeleton from "../components/DashboardSkeleton";
import NotificationService from '../services/NotificationService';

function Dashboard({ route }) {
    const nav = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [sensorEnabled, setSensorEnabled] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [databaseStatus, setDatabaseStatus] = useState("Not connected");
    const [address, setAddress] = useState("2972 Westheimer Rd. Santa Ana, Illinois 85486");
    const [userData, setUserData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const appState = useRef(AppState.currentState);
    const [updateInterval, setUpdateInterval] = useState(10);
    const [locationUpdateStatus, setLocationUpdateStatus] = useState('Offline');
    const [heading, setHeading] = useState(0);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [driverStatus, setDriverStatus] = useState('offline');
    const state = useNavigationState((state) => state);
    const currentRoute = state.routes[state.index].name;

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [currentTrip, setCurrentTrip] = useState(null);
    const [balanceData, setBalanceData] = useState({
        remainingBalance: 0
    });
    const [driverInfo, setDriverInfo] = useState(null);
    const debounceRef = useRef(null);
    const currentUser = auth().currentUser;
    const userId = currentUser?.uid || route.params?.userId || 'guest_user';
    const email = currentUser?.email || route.params?.email || 'guest@example.com';

    const tripId = route.params?.tripId || `trip_${Date.now()}`;
    const truckId = route.params?.truckId || `truck_${Date.now()}`;
    const [queueStatus, setQueueStatus] = useState({
    isCheckedIn: false,
    penaltyUntil: null,
    checkedInAt: null
});
const [isCheckInLoading, setIsCheckInLoading] = useState(false);

    const hasInitialized = useRef(false);
    const listenerAttached = useRef(false);

    const API_BASE_URL = 'http://192.168.1.4/capstone-1-eb';

    const handleNotificationEvent = useCallback((event) => {
    console.log('Notification event received:', event);
    
    switch (event.type) {
        case 'foreground_message':
        case 'notification_received':
            if (driverInfo?.driver_id) {
                fetchUnreadCount();
                initializeTripData();
            }
            break;
            
        case 'navigate_to_trip':
            nav.navigate('Trips');
            break;
    }
    }, [driverInfo?.driver_id, nav]);

    const fetchUnreadCount = useCallback(async () => {
    if (driverInfo?.driver_id) {
        try {
            const count = await NotificationService.getUnreadCount(driverInfo.driver_id);
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }
    }, [driverInfo?.driver_id]);

    useEffect(() => {
    const initializeNotifications = async () => {
        await NotificationService.initialize();

        if (driverInfo?.driver_id) {
            await NotificationService.registerTokenWithBackend(driverInfo.driver_id);
            await fetchUnreadCount();
        }

        NotificationService.addListener(handleNotificationEvent);
    };
    
    if (driverInfo?.driver_id) {
        initializeNotifications();
    }
    
    return () => {
        NotificationService.removeListener(handleNotificationEvent);
    };
    }, [driverInfo?.driver_id, handleNotificationEvent, fetchUnreadCount]);

    const NotificationBell = () => (
        <TouchableOpacity 
            style={dashboardstyles.notificationButton}
            onPress={() => nav.navigate('Notifications')}
        >
            <View style={dashboardstyles.notificationIconContainer}>
                <Image
                    source={require("../assets/notification.png")}
                    style={dashboardstyles.notificationIcon}
                    resizeMode="contain"
                />
                {unreadCount > 0 && (
                    <View style={dashboardstyles.notificationBadge}>
                        <Text style={dashboardstyles.notificationBadgeText}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
        

    const getDriverInfo = async () => {
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (!sessionData) return null;

            const session = JSON.parse(sessionData);
            const driverId = session?.userId;
            if (!driverId) return null;

            // Fetch the latest driver data, including the picture
            const response = await fetch(`${API_BASE_URL}/include/handlers/get_mobile_driver.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driver_id: driverId }),
            });
            const data = await response.json();

            if (data.success && data.driver) {
                const fullDriverInfo = {
                    driver_id: driverId,
                    name: data.driver.name,
                    driver_pic: data.driver.driver_pic, // The base64 image string
                };
                setDriverInfo(fullDriverInfo);
                return fullDriverInfo;
            } else {
                // Fallback to session data if the API call fails
                const fallbackInfo = {
                    driver_id: driverId,
                    name: session.driverName || email.split('@')[0],
                    driver_pic: null,
                };
                setDriverInfo(fallbackInfo);
                console.warn('Failed to fetch latest driver data, using session fallback.');
                return fallbackInfo;
            }
        } catch (error) {
            console.error('Error fetching driver info:', error);
            // On network errors, also attempt to fall back to session data
            try {
                const sessionData = await AsyncStorage.getItem('userSession');
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    const fallbackInfo = {
                        driver_id: session.userId,
                        name: session.driverName || email.split('@')[0],
                        driver_pic: null,
                    };
                    setDriverInfo(fallbackInfo);
                    return fallbackInfo;
                }
            } catch (fallbackError) {
                console.error('Error reading session for fallback:', fallbackError);
            }
        }
        return null;
    };

    const debouncedSetLocationEnabled = useCallback((value) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(() => {
            setLocationEnabled(value);
        }, 100);
    }, []);

    const fetchQueueStatus = useCallback(async () => {
    // This depends on getDriverInfo() running first
    if (!driverInfo?.driver_id) return;

    try {
        const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_driver_queue_status',
                driver_id: driverInfo.driver_id
            }),
        });
        const data = await response.json();
        if (data.success) {
            setQueueStatus({
                isCheckedIn: data.isCheckedIn,
                penaltyUntil: data.penaltyUntil,
                checkedInAt: data.checkedInAt,
            });
        }
    } catch (error) {
        console.error('Error fetching queue status:', error);
    }
}, [driverInfo?.driver_id]);

// Add this useFocusEffect hook to fetch the status when the screen is focused
useFocusEffect(
    useCallback(() => {
        fetchQueueStatus();
    }, [fetchQueueStatus])
);

const handleCheckIn = async () => {
    const now = new Date();
    const currentHour = now.getHours();

    // Check-in is only available between 6 AM and 10 PM (22:00)
    if (currentHour < 6 || currentHour >= 22) {
        Alert.alert("Check-In Window Closed", "You can only check-in between 6:00 AM and 10:00 PM.");
        return;
    }

    setIsCheckInLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'check_in_driver',
                driver_id: driverInfo.driver_id,
            }),
        });
        const data = await response.json();
        if (data.success) {
            Alert.alert("Check-In Successful", "You are now in the queue. Your check-in is valid for 16 hours.");
            await fetchQueueStatus(); // Refresh the UI
        } else {
            Alert.alert("Check-In Failed", data.message || "An unknown error occurred.");
        }
    } catch (error) {
        console.error('Error during check-in:', error);
        Alert.alert("Error", "A network error occurred. Please try again.");
    } finally {
        setIsCheckInLoading(false);
    }
};

// This helper determines the button's appearance and state
const getCheckInButtonState = () => {
    const now = new Date();
    if (queueStatus.penaltyUntil) {
        const penaltyTime = new Date(queueStatus.penaltyUntil);
        if (now < penaltyTime) {
            return {
                disabled: true,
                title: `PENALIZED UNTIL ${penaltyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                color: '#9CA3AF'
            };
        }
    }

    if (queueStatus.isCheckedIn) {
        const checkedInTime = new Date(queueStatus.checkedInAt);
        const expiryTime = new Date(checkedInTime.getTime() + 16 * 60 * 60 * 1000);
        return {
            disabled: true,
            title: `CHECKED IN (EXPIRES ${expiryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
            color: '#10B981' // Green for active
        };
    }
    
    const currentHour = now.getHours();
    if (currentHour < 6 || currentHour >= 22) {
         return {
            disabled: true,
            title: 'CHECK-IN OPENS AT 6 AM',
            color: '#9CA3AF' // Gray for unavailable
        };
    }

    return { disabled: isCheckInLoading, title: 'CHECK-IN TO QUEUE', color: '#3B82F6' }; // Blue for ready
};

const checkInButtonState = getCheckInButtonState();

    const fetchCurrentTrip = async (driver) => {
        try {
            const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_driver_current_trip',
                    driver_id: driver.driver_id,
                    driver_name: driver.name,
                }),
            });

            const data = await response.json();

            if (data.success && data.trip) {
                setCurrentTrip(data.trip);
                return data.trip;
            } else {
                setCurrentTrip(null);
                return null;
            }
        } catch (error) {
            console.error('Error fetching current trip:', error);
            setCurrentTrip(null);
            return null;
        }
    };

    const getCheckInStatusText = () => {
    const now = new Date();
    if (queueStatus.penaltyUntil) {
        const penaltyTime = new Date(queueStatus.penaltyUntil);
        if (now < penaltyTime) {
            return `On penalty cooldown until ${penaltyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    }

    if (queueStatus.isCheckedIn) {
         const checkedInTime = new Date(queueStatus.checkedInAt);
         const expiryTime = new Date(checkedInTime.getTime() + 16 * 60 * 60 * 1000);
         return `Checked in, valid until ${expiryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const currentHour = now.getHours();
    if (currentHour < 6 || currentHour >= 22) {
        return 'Check-in is available from 6 AM to 10 PM';
    }

    return 'Ready to check-in for a trip';
};

    const fetchBalanceData = async (tripId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_expenses_by_trip',
                    trip_id: tripId
                }),
            });

            const data = await response.json();

            if (data.success) {
                setBalanceData({
                    totalBudget: parseFloat(data.total_budget) || 0,
                    totalExpenses: parseFloat(data.total_expenses) || 0,
                    remainingBalance: parseFloat(data.remaining_balance) || 0
                });
            } else {
                setBalanceData({
                    totalBudget: 0,
                    totalExpenses: 0,
                    remainingBalance: 0
                });
            }
        } catch (error) {
            console.error('Error fetching balance data:', error);
            setBalanceData({
                totalBudget: 0,
                totalExpenses: 0,
                remainingBalance: 0
            });
        }
    };

    const initializeTripData = async () => {
        try {
            const driver = await getDriverInfo();
            if (driver) {
                const trip = await fetchCurrentTrip(driver);
                if (trip && trip.trip_id) {
                    await fetchBalanceData(trip.trip_id);
                }
            }
        } catch (error) {
            console.error("Initialization error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const listenToDriverStatus = useCallback(() => {
        if (userId !== 'guest_user') {
            const statusRef = database().ref(`/drivers/${userId}/status`);
            statusRef.on('value', snapshot => {
                const statusData = snapshot.val();
                if (statusData) {
                    setDriverStatus(statusData.status || 'offline');
                    console.log('Driver status updated:', statusData.status);
                }
            });

            return () => {
                statusRef.off();
            };
        }
    }, [userId]);

    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const toggleBalanceVisibility = () => {
        setIsBalanceVisible(!isBalanceVisible);
    };

    const syncLocationState = useCallback(() => {
        const status = LocationService.getTrackingStatus();
        console.log('Syncing location state:', status.isTracking);
        setLocationEnabled(status.isTracking);
        setDriverStatus(status.isTracking ? 'online' : 'offline');
    }, []);

    const handleLocationUpdate = useCallback((data) => {
        console.log('Location update received:', data);
        
        if (data.status) {
            setLocationUpdateStatus(data.status);
            if (data.status === 'Online' || data.status === 'Updated') {
                setDriverStatus('online');
                setLocationEnabled(true);
            } else if (data.status === 'Offline') {
                setDriverStatus('offline');
                setLocationEnabled(false);
            }
        }

        if (data.location) {
            setCurrentLocation(data.location);
            setHeading(data.location.heading || 0);
        }
        if (data.lastUpdated) {
            setLastUpdated(data.lastUpdated);
        }
        if (data.address) {
            setAddress(data.address);
        }
        if (data.error) {
            setDatabaseStatus(`Error: ${data.error}`);
        } else if (data.status === 'Updated') {
            setDatabaseStatus("Location updated successfully");
        }

        if (data.activeTrip && !currentTrip) {
            setCurrentTrip(data.activeTrip);
            if (data.activeTrip.trip_id) {
                fetchBalanceData(data.activeTrip.trip_id);
            }
        }
    }, [currentTrip]);

   useEffect(() => {
        if (hasInitialized.current) {
            console.log('Dashboard: Already initialized, skipping');
            return;
        }

        console.log('Dashboard: First time initialization');
        hasInitialized.current = true;

        const initialize = async () => {
            if (!listenerAttached.current) {
                console.log('Dashboard: Adding LocationService listener');
                LocationService.removeListener(handleLocationUpdate); // Remove any existing
                LocationService.addListener(handleLocationUpdate);
                listenerAttached.current = true;
            }

            const status = LocationService.getTrackingStatus();
            setLocationEnabled(status.isTracking);
            setDriverStatus(status.isTracking ? 'online' : 'offline');

            await initializeTripData();
            const unsubscribeStatus = listenToDriverStatus();

            return unsubscribeStatus;
        };

        const unsubscribePromise = initialize();

        return () => {
            unsubscribePromise.then(unsubscribe => {
                if (unsubscribe) unsubscribe();
            });

            if (listenerAttached.current) {
                console.log('Dashboard: Component unmounting, removing listener');
                LocationService.removeListener(handleLocationUpdate);
                listenerAttached.current = false;
            }

        };
    }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('Dashboard focused - syncing UI state from service');

      const status = LocationService.getTrackingStatus();

      setLocationEnabled(status.isTracking);
      setDriverStatus(status.isTracking ? 'online' : 'offline');

      if (status.activeTrip && (!currentTrip || currentTrip.trip_id !== status.activeTrip.trip_id)) {
        console.log('Syncing UI with the service\'s active trip');
        setCurrentTrip(status.activeTrip);

        if (status.activeTrip.trip_id) {
          fetchBalanceData(status.activeTrip.trip_id);
        }
      }

      else if (!status.activeTrip && currentTrip) {
        console.log('Service has no trip, clearing UI');
        setCurrentTrip(null);
      }
      
    }, [currentTrip?.trip_id])
  );


    useEffect(() => {
        if (userId !== 'guest_user') {
            const locationRef = database().ref(`/drivers/${userId}/location`);
            locationRef.on('value', snapshot => {
                const data = snapshot.val();
                if (data?.last_updated) {
                    const date = new Date(data.last_updated);
                    const optionsTime = {
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true,
                        timeZone: 'Asia/Manila'
                    };
                    const optionsDate = {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        timeZone: 'Asia/Manila'
                    };
                    const formatted = `${date.toLocaleTimeString('en-US', optionsTime)} - ${date.toLocaleDateString('en-US', optionsDate)}`;
                    setLastUpdated(formatted);
                }
            });

            return () => {
                locationRef.off();
            };
        }
    }, [userId, tripId]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App has come to the foreground');
                const status = LocationService.getTrackingStatus();
                setLocationEnabled(status.isTracking);
                setDriverStatus(status.driverStatus || 'offline');
                initializeTripData();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (locationEnabled) {
            LocationService.updateSettings(updateInterval, sensorEnabled);
        }
    }, [sensorEnabled, updateInterval, locationEnabled]);

 const handleLocationToggle = async (value) => {
        console.log(`Location toggle requested: ${value}`);
        
        if (value) {
            const currentStatus = LocationService.getTrackingStatus();

            if (currentStatus.isTracking) {
                console.log('Service already tracking - updating UI only');
                setLocationEnabled(true);
                setDriverStatus('online');
                return;
            }

            Alert.alert(
                "Enable Location?",
                `Do you want to allow location updates every ${updateInterval} seconds?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Allow",
                        onPress: async () => {
                            console.log('Starting location tracking for first time');
                            await LocationService.startTracking(userId, updateInterval, sensorEnabled);
                            setLocationEnabled(true);
                            setDriverStatus('online');
                            setLocationUpdateStatus('Online');
                        }
                    }
                ]
            );
        } else {
            const currentStatus = LocationService.getTrackingStatus();
            if (currentStatus.isTracking) {
                LocationService.stopTracking();
            }
            setLocationEnabled(false);
            setDriverStatus('offline');
            setLocationUpdateStatus('Offline');
        }
    };


    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <View style={dashboardstyles.container}>
            <View style={dashboardstyles.header}>
                <View style={dashboardstyles.headerTop}>
                    <View style={dashboardstyles.profileSection}>
                        <TouchableOpacity
                            onPress={() => nav.navigate("Profile", { userId, email })}
                            style={dashboardstyles.avatar}
                        >
                            {driverInfo?.driver_pic ? (
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${driverInfo.driver_pic}` }}
                                    style={{ width: '100%', height: '100%', borderRadius: 25 }} // Match avatar style
                                />
                            ) : (
                                <Text style={dashboardstyles.avatarText}>
                                    {driverInfo?.name ? driverInfo.name.charAt(0).toUpperCase() : ''}
                                </Text>
                            )}
                        </TouchableOpacity>
                        <View style={dashboardstyles.welcomeSection}>
                            <Text style={dashboardstyles.welcomeText}>Welcome back,</Text>
                            <Text style={dashboardstyles.userName}>{driverInfo?.name || email.split('@')[0]}</Text>
                        </View>
                    </View>
                        <NotificationBell />    
                </View>

                <View style={dashboardstyles.headerBottom}>
                    <View style={[dashboardstyles.statusBadge,
                    locationEnabled ? dashboardstyles.statusOnline : dashboardstyles.statusOffline
                    ]}>
                        <View style={[dashboardstyles.statusDot, {
                            backgroundColor: locationEnabled ? '#10B981' : '#EF4444'
                        }]} />
                        <Text style={dashboardstyles.statusText}>
                            {locationEnabled ? 'ONLINE' : 'OFFLINE'}
                        </Text>
                    </View>

                    <View style={dashboardstyles.timeSection}>
                        <Text style={dashboardstyles.todayText}>Today</Text>
                        <Text style={dashboardstyles.timeText}>
                            {currentTime.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}, {currentTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={dashboardstyles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={dashboardstyles.contentContainer}
            >
                <TouchableOpacity style={dashboardstyles.card} activeOpacity={0.98}>
                    <View style={dashboardstyles.cardHeader}>
                        <View style={dashboardstyles.cardTitleSection}>
                            <View style={dashboardstyles.walletIconContainer}>
                                <Image
                                    source={require("../assets/wallet.png")}
                                    style={dashboardstyles.walletIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={dashboardstyles.cardTitle}>Available Balance</Text>
                        </View>
                        <TouchableOpacity style={dashboardstyles.chevronButton}>
                            <Text style={dashboardstyles.chevronText}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={dashboardstyles.balanceSection}>
                        <Text style={dashboardstyles.balanceAmount}>
                            {isBalanceVisible
                                ? `₱ ${formatCurrency(balanceData.remainingBalance)}`
                                : '₱ *.**'
                            }
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={dashboardstyles.generateButton}
                        onPress={() => nav.navigate('Expenses', { tripId: currentTrip?.trip_id })}
                    >
                        <Text style={dashboardstyles.generateButtonText}>Generate Report</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity style={dashboardstyles.card} activeOpacity={0.98}>
                    <View style={dashboardstyles.cardHeader}>
                        <View style={dashboardstyles.cardTitleSection}>
                            <View style={dashboardstyles.navigationIconContainer}>
                                <Image
                                    source={require("../assets/trip.png")}
                                    style={dashboardstyles.walletIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={dashboardstyles.cardTitle}>Current Trip</Text>
                        </View>
                        <TouchableOpacity style={dashboardstyles.chevronButton}>
                            <Text style={dashboardstyles.chevronText}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={dashboardstyles.tripInfo}>
                        <View style={dashboardstyles.truckIconContainer}>
                            <View style={dashboardstyles.truckIcon} />
                        </View>
                        <View style={dashboardstyles.tripDetails}>
                            <Text style={dashboardstyles.tripDestination}>
                                {currentTrip?.destination || 'No active trip'}
                            </Text>
                            <Text style={dashboardstyles.tripSubtext}>
                                {currentTrip ? `${currentTrip.client} - ${currentTrip.plate_no}` : 'Please wait for dispatch'}
                            </Text>
                        </View>
                        {currentTrip && (
                            <View style={dashboardstyles.activeBadge}>
                                <Text style={dashboardstyles.activeBadgeText}>Active</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                <View style={dashboardstyles.sectionHeader}>
                    <Text style={dashboardstyles.sectionTitle}>Tracking Settings</Text>
                </View>
                  <View style={dashboardstyles.card}>
                    <View style={dashboardstyles.trackingRow}>
                        <View style={dashboardstyles.trackingInfo}>
                            <View style={dashboardstyles.queueIconContainer}>
                                <Text style={dashboardstyles.queueIcon}>🕒</Text>
                            </View>
                            <View style={dashboardstyles.trackingText}>
                                <Text style={dashboardstyles.trackingLabel}>Driver Queue Check In</Text>
                                {/* <Text style={dashboardstyles.trackingStatus}>
                                    {getCheckInStatusText()}
                                </Text> */}
                            </View>
                        </View>
                    </View>
                     <TouchableOpacity
                        style={[dashboardstyles.checkInButton, { backgroundColor: checkInButtonState.color, marginTop: 16 }]}
                        onPress={handleCheckIn}
                        disabled={checkInButtonState.disabled || isCheckInLoading}
                    >
                        <Text style={dashboardstyles.checkInButtonText}>
                            {isCheckInLoading ? 'PROCESSING...' : checkInButtonState.title}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={dashboardstyles.card}>
                    <View style={dashboardstyles.trackingRow}>
                        <View style={dashboardstyles.trackingInfo}>
                            <View style={dashboardstyles.locationIconContainer}>
                                <Image
                                    source={require("../assets/location.png")}
                                    style={dashboardstyles.walletIcon}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={dashboardstyles.trackingText}>
                                <Text style={dashboardstyles.trackingLabel}>Location Updates</Text>
                                <Text style={dashboardstyles.trackingStatus}>
                                    Currently {locationEnabled ? 'online' : 'offline'}
                                </Text>
                            </View>
                        </View>

                        <Switch
                            value={locationEnabled}
                            onValueChange={handleLocationToggle}
                            trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                            thumbColor={locationEnabled ? "#FFFFFF" : "#9CA3AF"}
                            style={dashboardstyles.switch}
                        />
                    </View>
                </View>
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
}

export default Dashboard;