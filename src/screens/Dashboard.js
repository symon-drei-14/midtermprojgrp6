import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    Switch,
    TouchableOpacity,
    Alert,
    ScrollView,
    AppState,
    Platform,
    Dimensions,
    StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navbar } from "../styles/Navbar";
import { dashboardstyles } from "../styles/dashboardcss";
import homeIcon from "../assets/Home.png";
import { PermissionsAndroid, Linking } from 'react-native';
import userIcon from "../assets/schedule.png";
import profileicon from "../assets/profile2.png";
import LocationService from "../services/LocationService";
import { useNavigationState } from "@react-navigation/native";

function Dashboard({ route, navigation }) {
    const nav = useNavigation();
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

    
    const [currentTrip, setCurrentTrip] = useState(null);
    const [balanceData, setBalanceData] = useState({
        remainingBalance: 0
    });
    const [driverInfo, setDriverInfo] = useState(null);

    const currentUser = auth().currentUser;
    const userId = currentUser?.uid || route.params?.userId || 'guest_user';
    const email = currentUser?.email || route.params?.email || 'guest@example.com';
    const driverName = currentUser?.displayName || route.params?.driverName || email.split('@')[0];

    const tripId = route.params?.tripId || `trip_${Date.now()}`;
    const truckId = route.params?.truckId || `truck_${Date.now()}`;

    // const API_BASE_URL = 'http://192.168.100.17/Capstone-1-eb';
    const API_BASE_URL = 'http://192.168.1.5/capstone-1-eb';

    // Get driver info from AsyncStorage
    const getDriverInfo = async () => {
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                if (session?.userId && session?.driverName) {
                    const driver = {
                        driver_id: session.userId,
                        name: session.driverName,
                    };
                    setDriverInfo(driver);
                    return driver;
                }
            }
        } catch (error) {
            console.error('Error getting driver info:', error);
        }
        return null;
    };

    // Fetch current trip data
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

    // Initialize trip and balance data
    const initializeTripData = async () => {
        const driver = await getDriverInfo();
        if (driver) {
            const trip = await fetchCurrentTrip(driver);
            if (trip && trip.trip_id) {
                await fetchBalanceData(trip.trip_id);
            }
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

   
    const handleReportPress = () => {
        nav.navigate("Reports", { userId, tripId, truckId });
    };

    
    const handleLocationUpdate = useCallback((data) => {
        if (data.status) {
            setLocationUpdateStatus(data.status);
            if (data.status === 'Online' || data.status === 'Updated') {
                setDriverStatus('online');
            } else if (data.status === 'Offline') {
                setDriverStatus('offline');
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
        if (data.isTracking !== undefined) {
            setLocationEnabled(data.isTracking);
        }
        if (data.error) {
            setDatabaseStatus(`Error: ${data.error}`);
        } else if (data.status === 'Updated') {
            setDatabaseStatus("Location updated successfully");
        }
    }, []);

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        LocationService.addListener(handleLocationUpdate);
        
        const status = LocationService.getTrackingStatus();
        setLocationEnabled(status.isTracking);
        setSensorEnabled(status.sensorEnabled);
        setUpdateInterval(status.updateInterval);
        setDriverStatus(status.driverStatus || 'offline'); 

        if (status.isTracking) {
            setLocationUpdateStatus('Online'); 
            setDriverStatus('online');
        } else {
            setLocationUpdateStatus('Offline');
            setDriverStatus('offline');
        }

        // Initialize trip and balance data
        initializeTripData();

        // Listen to driver status changes
        const unsubscribeStatus = listenToDriverStatus();

        return () => {
            LocationService.removeListener(handleLocationUpdate);
            if (unsubscribeStatus) unsubscribeStatus();
        };
    }, [handleLocationUpdate, listenToDriverStatus]);

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
        if (value) {
            if (!auth().currentUser && userId === 'guest_user') {
                Alert.alert('Authentication Required', 'Please log in to track your location.');
                return;
            }

            Alert.alert(
                "Enable Location?",
                `Do you want to allow location updates every ${updateInterval} seconds?`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Allow",
                        onPress: () => {
                            LocationService.startTracking(userId, updateInterval, sensorEnabled);
                            setLocationEnabled(true);
                            setDriverStatus('online');
                        }
                    }
                ]
            );
        } else {
            LocationService.stopTracking();
            setLocationEnabled(false);
            setDriverStatus('offline'); 
        }
    };

    const handleSensorToggle = (value) => {
        setSensorEnabled(value);
        if (locationEnabled) {
            LocationService.updateSettings(updateInterval, value);
        }
    };

    
    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
            case 'Online':
                return '#4CAF50';
            case 'offline':
            case 'Offline':
                return '#FF5722';
            case 'Updated':
            case 'Updating':
                return '#FFC107';
            default:
                return '#FFC107';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'online':
                return 'Online';
            case 'offline':
                return 'Offline';
            case 'updated':
            case 'updating':
                return 'Updating';
            default:
                return status || 'Offline';
        }
    };

    return (
        <View style={dashboardstyles.mainContainer}>
            {/* Header Section */}
            <View style={dashboardstyles.headerSection}>
                <View style={dashboardstyles.headerGradient}>
                    <View style={dashboardstyles.profileContainer}>
                        <TouchableOpacity 
                            onPress={() => nav.navigate("Profile", { userId, email })}
                            style={dashboardstyles.profilePlaceholder}
                        >
                            <Text style={dashboardstyles.profileEmoji}>👻</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={dashboardstyles.welcomeText}>Welcome back,</Text>
                    <Text style={dashboardstyles.driverName}>{driverName}</Text>

                    <View style={dashboardstyles.statusBadge}>
                        <View style={[
                            dashboardstyles.statusDot, 
                            { backgroundColor: getStatusColor(locationUpdateStatus) }
                        ]} />
                        <Text style={dashboardstyles.statusBadgeText}>
                            {getStatusText(locationUpdateStatus)}
                        </Text>
                    </View>
                    
                    <View style={dashboardstyles.dateTimeContainer}>
                        <Text style={dashboardstyles.dateTimeText}>
                            {currentTime.toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                style={dashboardstyles.scrollContainer}
                contentContainerStyle={dashboardstyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={dashboardstyles.balanceCard}>
                    <View style={dashboardstyles.balanceHeader}>
                        <View style={dashboardstyles.balanceTitleContainer}>
                            <Text style={dashboardstyles.balanceTitle}>Available Balance</Text>
                            <TouchableOpacity 
                                onPress={toggleBalanceVisibility}
                                style={dashboardstyles.eyeButton}
                            >
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={dashboardstyles.balanceAmountContainer}>
                        <Text style={dashboardstyles.balanceAmount}>
                            {isBalanceVisible 
                                ? `₱ ${formatCurrency(balanceData.remainingBalance)}` 
                                : '₱ ••••••••'
                            }
                        </Text>
                    </View>

                    <View style={dashboardstyles.balanceActions}>
                        <TouchableOpacity 
                            style={dashboardstyles.reportButton}
                            onPress={() => nav.navigate('Expenses', { tripId: currentTrip?.trip_id })}
                        >
                            <Text style={dashboardstyles.reportButtonText}>Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={dashboardstyles.locationSection}>
                    <View style={dashboardstyles.locationCard}>
                        <View style={dashboardstyles.cardHeader}>
                            <View style={dashboardstyles.locationIcon}>
                                <Text style={dashboardstyles.locationIconText}>🚛</Text>
                            </View>
                            <Text style={dashboardstyles.cardTitle}>Current Trip</Text>
                            <View style={[
                                dashboardstyles.miniStatusDot, 
                                { backgroundColor: getStatusColor(locationUpdateStatus) }
                            ]} />
                        </View>
                        <Text style={dashboardstyles.addressText}>
                            {currentTrip ? (
                                `${currentTrip.destination || 'No destination'}\n${currentTrip.client || 'No client'} - ${currentTrip.plate_no || 'No truck'}`
                            ) : (
                                'No active trip'
                            )}
                        </Text>
                        {currentTrip && (
                            <Text style={dashboardstyles.lastUpdatedText}>
                                Status: {currentTrip.status || 'Unknown'} • Tracking: {getStatusText(locationUpdateStatus)}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Controls Section */}
                <View style={dashboardstyles.controlsSection}>
                    <Text style={dashboardstyles.sectionTitle}>Tracking Settings</Text>
                    
                    <View style={dashboardstyles.controlCard}>
                        <View style={dashboardstyles.controlHeader}>
                            <View style={dashboardstyles.controlInfo}>
                                <Text style={dashboardstyles.controlTitle}>Location Updates</Text>
                                <Text style={dashboardstyles.controlSubtitle}>
                                    {getStatusText(locationUpdateStatus)}
                                </Text>
                            </View>
                            <Switch 
                                value={locationEnabled} 
                                onValueChange={handleLocationToggle}
                                trackColor={{ false: "#E0E0E0", true: "#81C784" }}
                                thumbColor={locationEnabled ? "#4CAF50" : "#BDBDBD"}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={navbar.bottomNav}>
                <TouchableOpacity style={navbar.navButton} onPress={() => nav.navigate("Dashboard")}>
                    {currentRoute === "Dashboard" && <View style={navbar.activeIndicator} />}
                    <Image source={homeIcon} style={navbar.navIcon} />
                    <Text style={currentRoute === "Dashboard" ? navbar.activeNavLabel : navbar.navLabel}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={navbar.navButton} onPress={() => nav.navigate("Trips")}>
                    {currentRoute === "Trips" && <View style={navbar.activeIndicator} />}
                    <Image source={userIcon} style={navbar.navIcon} />
                    <Text style={currentRoute === "Trips" ? navbar.activeNavLabel : navbar.navLabel}>
                        Trips
                    </Text>
                </TouchableOpacity>
            
                <TouchableOpacity style={navbar.navButton} onPress={() => nav.navigate("Profile")}>
                    {currentRoute === "Profile" && <View style={navbar.activeIndicator} />}
                    <Image source={profileicon} style={navbar.navIcon} />
                    <Text style={currentRoute === "Profile" ? navbar.activeNavLabel : navbar.navLabel}>
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Dashboard;