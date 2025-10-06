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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import BackgroundFetch from 'react-native-background-fetch';

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
    const [weeklyTripsCount, setWeeklyTripsCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentTrips, setRecentTrips] = useState([]);
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

    const API_BASE_URL = 'http://192.168.1.3/capstone-1-eb';

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
        LocationService.configureBackgroundFetch().catch(() => {});
        BackgroundFetch.start().catch(() => {});
    }, []);

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

    const getDriverInfo = async () => {
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (!sessionData) return null;

            const session = JSON.parse(sessionData);
            const driverId = session?.userId;
            if (!driverId) return null;

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
                    driver_pic: data.driver.driver_pic,
                };
                setDriverInfo(fullDriverInfo);
                return fullDriverInfo;
            } else {
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

    useFocusEffect(
        useCallback(() => {
            fetchQueueStatus();
        }, [fetchQueueStatus])
    );

const getWeeklyTripsCount = (trips) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return trips.filter(trip => {
    const tripDate = new Date(trip.date);
    return tripDate >= startOfWeek && 
           tripDate < endOfWeek && 
           trip.status === 'Completed';
  }).length;
};

const fetchTripsData = useCallback(async () => {
  if (!driverInfo?.driver_id) return;

  try {
    const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_trips_with_drivers',
        driver_id: driverInfo.driver_id,
      }),
    });

    const data = await response.json();
    if (data.success) {
      const allTrips = data.trips || [];

      setWeeklyTripsCount(getWeeklyTripsCount(allTrips));

      const completedTrips = allTrips
        .filter(trip => trip.status === 'Completed')
        .slice(0, 5);
      setRecentTrips(completedTrips);
    }
  } catch (error) {
    console.error('Error fetching trips data:', error);
  }
}, [driverInfo?.driver_id]);

const handleCheckIn = async () => {
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
      setQueueStatus({
        ...queueStatus,
        isCheckedIn: true,
        penaltyUntil: null,
      });
      Alert.alert("Check-In Successful", "You are now checked in.");
    } else {
      Alert.alert("Check-In Failed", data.message || "An unknown error occurred.");
    }
  } catch (error) {
    console.error("Error during check-in:", error);
    Alert.alert("Error", "A network error occurred. Please try again.");
  } finally {
    setIsCheckInLoading(false);
  }
};



    const getCheckInButtonState = () => {
    const now = new Date();

    // First, let's see if the driver is currently penalized.
    if (queueStatus?.penaltyUntil) {
        const penaltyTime = new Date(queueStatus.penaltyUntil);
        if (now < penaltyTime) {
            return {
                disabled: true,
                title: 'PENALIZED',
                color: '#9CA3AF',
            };
        }
    }

    // If the driver is already checked in, that's the most important status to show.
    if (queueStatus?.isCheckedIn) {
        return {
            disabled: true,
            title: 'CHECKED IN',
            color: '#10B981',
        };
    }

    // Now, if they aren't checked in, let's see if the check-in window is open.
    const currentHour = now.getHours();
    if (currentHour < 6 || currentHour >= 22) { // 6 AM is hour 6, 10 PM is hour 22
        return {
            disabled: true,
            title: 'CHECK-IN CLOSED',
            color: '#9CA3AF',
        };
    }

    // If none of the above, the button is ready for check-in.
    return {
        disabled: isCheckInLoading,
        title: 'CHECK IN',
        color: '#F43F5E',
    };
};

    const checkInButtonState = getCheckInButtonState();

 const fetchTrips = async () => {
    try {
      setLoading(true);
      let driver = driverInfo;
      if (!driver) {
        driver = await getDriverInfo();
        if (!driver) { setLoading(false); return; }
      }
  
      const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_trips_with_drivers',
          driver_id: driver.driver_id,
        }),
      });
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch trip data.");
      }
  
      const allTrips = data.trips || [];
      setWeeklyTripsCount(getWeeklyTripsCount(allTrips));
      const activeTrip = allTrips.find(trip => trip.status === 'En Route');
      const pendingTrips = allTrips.filter(trip => trip.status === 'Pending');
  
      let reassignmentTriggered = false;
      const processedPendingTrips = [];
  
      // This loop checks each pending trip for its checklist status and deadline.
      for (const trip of pendingTrips) {
        const checklistResponse = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_checklist', trip_id: trip.trip_id }),
        });
        const checklistData = await checklistResponse.json();
        const hasChecklist = checklistData.success && checklistData.checklist;
  
        const now = new Date();
        const tripDate = new Date(trip.date);
        const oneHourBefore = new Date(tripDate.getTime() - (1 * 60 * 60 * 1000));
        
        let wasRecentlyReassigned = false;
        // Check if the trip was recently reassigned to give the new driver a grace period.
        if (trip.last_modified_at && trip.edit_reason?.includes('reassigned')) {
            const modifiedDate = new Date(trip.last_modified_at);
            // We give the new driver a 1-hour grace period to submit their checklist.
            const gracePeriod = 1 * 60 * 60 * 1000;
            if (now.getTime() - modifiedDate.getTime() < gracePeriod) {
                wasRecentlyReassigned = true;
            }
        }
  
        // If the deadline has passed, there's no checklist, AND it wasn't just reassigned, then we trigger a reassignment.
        if (now > oneHourBefore && !hasChecklist && !wasRecentlyReassigned) {
          console.log(`Trip ID ${trip.trip_id} missed deadline. Reassigning...`);
          const reassigned = await triggerReassignment(trip.trip_id, driver.driver_id, 'missed_deadline', false);
          if (reassigned) {
            reassignmentTriggered = true;
          }
          continue; // Don't add this trip to the UI list as it's being removed from the driver.
        }
        
        // If the trip is fine, add it to our list for display.
        processedPendingTrips.push({ ...trip, hasChecklist });
      }
  
      // If a reassignment happened, we refresh the entire screen to get the latest data.
      if (reassignmentTriggered) {
        Alert.alert("Schedule Updated", "One or more trips were reassigned due to a missed checklist deadline.");
        await fetchTrips(); // Simple recursive call to refresh all data.
        return;
      }
  
      // If everything is normal, update the state with the trips.
      setCurrentTrip(activeTrip);
      setScheduledTrips(processedPendingTrips);
      if (activeTrip) setStatus(activeTrip.status);
  
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert("Error", "Could not load trip data. Please pull down to refresh.");
    } finally {
      setLoading(false);
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

        return 'Check-in to receive trips';
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

const fetchCurrentTrip = async (driver) => {
  try {
    const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_trips_with_drivers',
        driver_id: driver.driver_id,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return null; // don’t overwrite currentTrip
    }

    const allTrips = data.trips || [];
    const activeTrip = allTrips.find(trip => trip.status === 'En Route');

    if (activeTrip) {
      setCurrentTrip(activeTrip);
      return activeTrip;
    }

    return null; // keep whatever LocationService already has
  } catch (error) {
    console.error("Error fetching current trip:", error);
    return null;
  }
};

const initializeTripData = async () => {
  try {
    const driver = await getDriverInfo();
    if (!driver) return;

    // 🔑 Prefer LocationService’s trip if available
    const status = LocationService.getTrackingStatus();
    if (status?.activeTrip) {
      setCurrentTrip(status.activeTrip);
      if (status.activeTrip.trip_id) {
        await fetchBalanceData(status.activeTrip.trip_id);
      }
      return;
    }

    // fallback → fetch from API
    const trip = await fetchCurrentTrip(driver);
    if (trip?.trip_id) {
      await fetchBalanceData(trip.trip_id);
    }
  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    setIsLoading(false);
  }
};


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
        });
        };

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        };

const getTimeAgo = (trip) => {
    // Use last_modified_at for completed trips, fall back to trip date
    const dateString = trip.status === 'Completed' && trip.last_modified_at 
        ? trip.last_modified_at 
        : trip.date;
    
    if (!dateString) return "N/A";
    const tripDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - tripDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        return formatDate(dateString);
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
        if (data.status === 'Updated' || data.activeTrip || data.location) {
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
                LocationService.removeListener(handleLocationUpdate);
                LocationService.addListener(handleLocationUpdate);
                listenerAttached.current = true;
            }

            const status = LocationService.getTrackingStatus();
            setLocationEnabled(status.isTracking);
            setDriverStatus(status.isTracking ? 'online' : 'offline');

            await initializeTripData();
            await fetchTripsData();
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
    const refreshData = async () => {
      try {
        const driver = await getDriverInfo();
        if (!driver) return;

        const status = LocationService.getTrackingStatus();

        if (status?.activeTrip) {
          console.log("Using service trip:", status.activeTrip.trip_id);
          setCurrentTrip(status.activeTrip);
          await fetchBalanceData(status.activeTrip.trip_id);
        } else {
          console.log("No active trip from service, leaving UI as is.");
        }
        await fetchTripsData();
      } catch (error) {
        console.error("Focus effect error:", error);
      }
    };

    refreshData();
  }, [fetchTripsData])
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
            <View style={dashboardstyles.redHeader}>
                <View style={dashboardstyles.headerCard}>
                <View style={dashboardstyles.headerTop}>
                    <View style={dashboardstyles.profileSection}>
                        <TouchableOpacity
                            onPress={() => nav.navigate("Profile", { userId, email })}
                            style={dashboardstyles.smallAvatar}
                        >
                            {driverInfo?.driver_pic ? (
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${driverInfo.driver_pic}` }}
                                    style={{ width: '100%', height: '100%', borderRadius: 20 }}
                                />
                            ) : (
                                <Text style={dashboardstyles.smallAvatarText}>
                                    {driverInfo?.name ? driverInfo.name.charAt(0).toUpperCase() : 'S'}
                                </Text>
                            )}
                        </TouchableOpacity>
                        <View style={dashboardstyles.welcomeColumn}>
                            <Text style={dashboardstyles.userNameWhite}>{driverInfo?.name || 'symons'}</Text>
                        </View>
                    </View>

                    <View style={dashboardstyles.headerRight}>
                        <View style={[
                            dashboardstyles.statusBadgeCompact,
                            locationEnabled ? dashboardstyles.statusOnline : dashboardstyles.statusOffline
                                ]}>
                            <View style={[dashboardstyles.statusDot, { backgroundColor: locationEnabled ? '#10B981' : '#EF4444' }]} />
                            <Text style={dashboardstyles.statusText}>{locationEnabled ? 'ONLINE' : 'OFFLINE'}</Text>
                        </View>
                    </View>
                </View>
                </View>
            </View>
        <ScrollView
            style={dashboardstyles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={dashboardstyles.scrollContent}
        >
            <View style={dashboardstyles.statsContainer}>
                <View style={dashboardstyles.statCard}>
                    <Icon name="calendar" size={22} color="#EC4899" />
                    <Text style={dashboardstyles.statLabel}>Trips by Week</Text>
                    <Text style={dashboardstyles.statValue}>{weeklyTripsCount}</Text>
                </View>
                <View style={dashboardstyles.statCard}>
                    <Icon name="credit-card" size={22} color="#EC4899" />
                    <Text style={dashboardstyles.statLabel}>Available Balance</Text>
                    <Text style={dashboardstyles.statValue}>₱{formatCurrency(balanceData.remainingBalance)}</Text>
                </View>
            </View>
            <View style={dashboardstyles.contentArea}>
                <Text style={dashboardstyles.sectionTitle}>Quick Actions</Text>


                <View style={dashboardstyles.quickActionsContainer}>
                <TouchableOpacity
                    style={dashboardstyles.generateReportButton}
                    onPress={() => nav.navigate('Expenses', { tripId: currentTrip?.trip_id })}
                >
                    <LinearGradient colors={["#FF6680", "#F43F5E"]} style={{ position:'absolute', left:0, right:0, top:0, bottom:0 }} />
                    <Icon name="file-text" size={16} color="#FFFFFF" style={dashboardstyles.actionIcon} />
                    <Text style={dashboardstyles.generateReportText}>Generate Report</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[dashboardstyles.checkInButton, { backgroundColor: checkInButtonState.color }]}
                    onPress={handleCheckIn}
                    disabled={checkInButtonState.disabled || isCheckInLoading}
                >
                    <Text style={dashboardstyles.checkInButtonText}>
                    {isCheckInLoading ? 'PROCESSING...' : checkInButtonState.title}
                    </Text>
                </TouchableOpacity>
                </View>

                <View style={dashboardstyles.locationCard}>
                    <View style={dashboardstyles.locationLeft}>
                        <View style={dashboardstyles.locationIconWrap}>
                            <Icon name="navigation" size={16} color="#6B7280" />
                        </View>
                        <View>
                            <Text style={dashboardstyles.locationTitle}>Location Updates</Text>
                            <Text style={dashboardstyles.locationSub}>Share real-time location during trips</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => handleLocationToggle(!locationEnabled)}
                        style={[dashboardstyles.locationPill, locationEnabled ? dashboardstyles.pillOn : dashboardstyles.pillOff]}
                        activeOpacity={0.8}
                    >
                        <Text style={[dashboardstyles.locationPillText, locationEnabled ? dashboardstyles.pillTextOn : dashboardstyles.pillTextOff]}>
                            {locationEnabled ? 'ON' : 'OFF'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={dashboardstyles.sectionContainer}>
                    {currentTrip ? (
                        <>
                            <Text style={dashboardstyles.sectionTitle}>Current Trip</Text>

                            <View style={dashboardstyles.tripCard}> 
                                
                                <View style={dashboardstyles.currentTripItem}>
                                    <View style={dashboardstyles.iconContainer}>
                                        <Icon name="map-pin" size={20} color="#dc2626" />
                                    </View>
                                    <View style={dashboardstyles.tripInfo}>
                                        <Text style={dashboardstyles.tripDestination}>
                                            {currentTrip.destination || "N/A"}
                                        </Text>
                                        <Text style={dashboardstyles.tripSubInfo}>
                                            {currentTrip.client || "N/A"} • {currentTrip.container_no || "N/A"}
                                        </Text>
                                    </View>
                                    <View style={[dashboardstyles.statusBadgeSolid, (currentTrip.status === 'En Route') ? dashboardstyles.statusEnRoute : null]}>
                                        <Text style={[dashboardstyles.statusBadgeText, (currentTrip.status === 'En Route') ? dashboardstyles.statusBadgeTextLight : null]}>
                                            {currentTrip.status || "Standby"}
                                        </Text>
                                    </View>
                                </View>

                                <View style={dashboardstyles.timeRow}>
                                    <View style={dashboardstyles.timeColumn}>
                                        <Text style={dashboardstyles.timeLabel}>Departure</Text>
                                        <Text style={dashboardstyles.timeValue}>
                                            {formatTime(currentTrip.date)}
                                        </Text>
                                    </View>
                                    <View style={dashboardstyles.timeColumnRight}>
                                        <Text style={dashboardstyles.timeLabel}>Date</Text>
                                        <Text style={dashboardstyles.timeValue}>
                                            {formatDate(currentTrip.date)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={dashboardstyles.emptyState}>
                            <Text style={dashboardstyles.emptyTitle}>No Active Trip</Text>
                            <Text style={dashboardstyles.emptySubtitle}>
                                You don't have any active trips at the moment
                            </Text>
                        </View>
                    )}
                </View>
                <View style={dashboardstyles.sectionContainer}>
                <Text style={dashboardstyles.sectionTitle}>Recent Trips</Text>
                    <View style={dashboardstyles.tripCard}>
                        {recentTrips.length > 0 ? (
                            recentTrips.map((trip, index) => {
                                const timeAgo = getTimeAgo(trip);
                                const isLast = index === recentTrips.length - 1;
                                return (
                                    <View key={trip.trip_id} style={[dashboardstyles.recentTripItem, isLast && { borderBottomWidth: 0 }] }>
                                        <View style={dashboardstyles.recentIconCircle}>
                                            <Icon name="check" size={16} color="#10B981" />
                                        </View>
                                        <View style={dashboardstyles.recentTripInfo}>
                                            <Text style={dashboardstyles.recentTripTitle}>{trip.destination || 'Unknown Destination'}</Text>
                                            <Text style={dashboardstyles.recentTripSub}>Completed • {timeAgo}</Text>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={dashboardstyles.recentTripItem}>
                                <View style={dashboardstyles.recentIconCircle}>
                                    <Icon name="info" size={16} color="#9CA3AF" />
                                </View>
                                <View style={dashboardstyles.recentTripInfo}>
                                    <Text style={dashboardstyles.recentTripTitle}>No Recent Trips</Text>
                                    <Text style={dashboardstyles.recentTripSub}>Completed trips will appear here</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>

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
}

export default Dashboard;