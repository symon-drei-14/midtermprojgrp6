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
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from "@react-navigation/native";
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { dashboardstyles } from "../styles/dashboardcss";
import { PermissionsAndroid, Linking } from 'react-native';
import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import profileicon from "../assets/profile.png";

function Dashboard({ route, navigation }) {
    const nav = useNavigation();
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [sensorEnabled, setSensorEnabled] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [databaseStatus, setDatabaseStatus] = useState("Not connected");
    const locationTimerRef = useRef(null);
    const [address, setAddress] = useState("2972 Westheimer Rd. Santa Ana, Illinois 85486");
    const [userData, setUserData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const appState = useRef(AppState.currentState);
    const [updateInterval, setUpdateInterval] = useState(10); 
    const [locationUpdateStatus, setLocationUpdateStatus] = useState('Idle');
    const [heading, setHeading] = useState(0);

    const currentUser = auth().currentUser;
    const userId = currentUser?.uid || route.params?.userId || 'guest_user';
    const email = currentUser?.email || route.params?.email || 'guest@example.com';
    const driverName = currentUser?.displayName || route.params?.driverName || email.split('@')[0];

    const tripId = route.params?.tripId || `trip_${Date.now()}`;
    const truckId = route.params?.truckId || `truck_${Date.now()}`;

    const locationPermission = async () => {
        if (Platform.OS === 'ios') {
            return true;
        }
        
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app needs access to your location to track your trips.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude, heading: deviceHeading } = position.coords;
                    resolve({ latitude, longitude, heading: deviceHeading });
                },
                error => {
                    reject(error);
                },
                {
                    enableHighAccuracy: sensorEnabled,
                    timeout: 20000,
                    maximumAge: 1000
                }
            );
        });
    };

    const getLiveLocation = async () => {
        setLocationUpdateStatus('Updating...');
        try {
            const locPermissionGranted = await locationPermission();
            if (locPermissionGranted) {
                const { latitude, longitude, heading: deviceHeading } = await getCurrentLocation();
                console.log(`New location: ${latitude}, ${longitude}, heading: ${deviceHeading}`);
                
                setHeading(deviceHeading || 0);
                storeLocationToFirebase(latitude, longitude, deviceHeading);
                setCurrentLocation({ latitude, longitude });
                
                const now = new Date();
                const formattedTime = now.toLocaleString("en-US", {
                    timeZone: "Asia/Manila",
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true
                });
                setLastUpdated(formattedTime);
                setLocationUpdateStatus('Updated');
                setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                
                setTimeout(() => {
                    if (locationEnabled) {
                        setLocationUpdateStatus('Tracking');
                    }
                }, 2000);
            } else {
                Alert.alert(
                    'Permission Required',
                    'Location permission is required for tracking. Please grant permission in app settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Open Settings', 
                            onPress: () => Platform.OS === 'ios' ? 
                                Linking.openURL('app-settings:') : 
                                Linking.openSettings() 
                        }
                    ]
                );
            }
        } catch (error) {
            console.log('Error getting location:', error);
            setLocationUpdateStatus('Error: ' + error.code);
            
            if (error.code === 3) {
                try {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            storeLocationToFirebase(latitude, longitude);
                            setLocationUpdateStatus('Updated (Lower Accuracy)');
                        },
                        (fallbackError) => {
                            console.log("Fallback location also failed:", fallbackError);
                            setLocationUpdateStatus('Location Unavailable');
                        },
                        {
                            enableHighAccuracy: false,
                            timeout: 10000,
                            maximumAge: 60000
                        }
                    );
                } catch (fallbackError) {
                    console.error("Fallback location exception:", fallbackError);
                }
            }
            
            setTimeout(() => {
                if (locationEnabled) {
                    setLocationUpdateStatus('Tracking');
                }
            }, 2000);
        }
    };

    const storeLocationToFirebase = useCallback((latitude, longitude, heading = 0) => {
        if (!auth().currentUser && userId === 'guest_user') {
            Alert.alert('Authentication Required', 'Please log in to track your location.');
            setLocationEnabled(false);
            stopLocationTracking();
            return;
        }

        database().ref(`/drivers/${userId}/location`).set({
            latitude,
            longitude,
            heading,
            last_updated: database.ServerValue.TIMESTAMP
        }).then(() => {
            console.log("Location successfully updated in Firebase");
            setDatabaseStatus("Location updated successfully");
        }).catch((error) => {
            console.error("Error updating location:", error);
            setDatabaseStatus(`Error: ${error.message}`);
        });
    }, [userId, locationEnabled]);

    const startLocationTracking = useCallback(() => {
        console.log(`Starting location tracking with interval: ${updateInterval} seconds...`);
        setLocationUpdateStatus('Starting...');
        
        if (locationTimerRef.current !== null) {
            clearInterval(locationTimerRef.current);
            locationTimerRef.current = null;
        }

        getLiveLocation();
        
        const intervalInMs = updateInterval * 1000;
        locationTimerRef.current = setInterval(() => {
            console.log(`Interval triggered for location update (every ${updateInterval}s)`);
            getLiveLocation();
        }, intervalInMs);
        
        setLocationUpdateStatus('Tracking');
    }, [updateInterval]);

    const stopLocationTracking = useCallback(() => {
        console.log("Stopping location tracking...");
        if (locationTimerRef.current !== null) {
            clearInterval(locationTimerRef.current);
            locationTimerRef.current = null;
        }
        setLocationUpdateStatus('Stopped');
    }, []);

    useEffect(() => {
        getLiveLocation();
        
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App has come to the foreground');
                if (locationEnabled) {
                    getLiveLocation();
                    startLocationTracking();
                }
            }
            appState.current = nextAppState;
        });

        return () => {
            stopLocationTracking();
            subscription.remove();
        };
    }, []);

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
        if (locationEnabled) {
            startLocationTracking();
        } else {
            stopLocationTracking();
        }
        
        return () => {
            if (locationTimerRef.current !== null) {
                clearInterval(locationTimerRef.current);
                locationTimerRef.current = null;
            }
        };
    }, [locationEnabled, startLocationTracking, stopLocationTracking]);

    useEffect(() => {
        if (locationEnabled) {
            startLocationTracking();
        }
    }, [sensorEnabled, startLocationTracking, locationEnabled]);

    useEffect(() => {
        if (locationEnabled) {
            startLocationTracking();
        }
    }, [updateInterval, startLocationTracking, locationEnabled]);

    const handleLocationToggle = async (value) => {
        if (value) {
            if (!auth().currentUser && userId === 'guest_user') {
                Alert.alert('Authentication Required', 'Please log in to track your location.');
                return;
            }
        
            const hasPermission = await locationPermission();
            
            if (hasPermission) {
                Alert.alert(
                    "Enable Location?",
                    `Do you want to allow location updates every ${updateInterval} seconds?`,
                    [
                        { text: "Cancel", style: "cancel", onPress: () => setLocationEnabled(false) },
                        {
                            text: "Allow",
                            onPress: () => {
                                Geolocation.getCurrentPosition(
                                    () => {
                                        setLocationEnabled(true);
                                    },
                                    (error) => {
                                        if (error.code === 2) {
                                            Alert.alert(
                                                'Location Services Disabled',
                                                'Please enable location services in your device settings.',
                                                [
                                                    { text: 'Cancel', style: 'cancel' },
                                                    { 
                                                        text: 'Open Settings', 
                                                        onPress: () => Platform.OS === 'ios' ? 
                                                            Linking.openURL('app-settings:') : 
                                                            Linking.openSettings() 
                                                    }
                                                ]
                                            );
                                        } else {
                                            setLocationEnabled(true);
                                        }
                                    },
                                    { timeout: 5000 }
                                );
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Permission Required',
                    'Location permission is required for tracking.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Open Settings', 
                            onPress: () => Platform.OS === 'ios' ? 
                                Linking.openURL('app-settings:') : 
                                Linking.openSettings() 
                        }
                    ]
                );
            }
        } else {
            setLocationEnabled(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
                <Image
                    source={require("../assets/map.png")}
                    style={dashboardstyles.mapImage}
                    resizeMode="cover"
                />
                <View style={dashboardstyles.card}>
                    <Text style={dashboardstyles.welcomeText}>Welcome, {driverName}</Text>

                    <Text style={dashboardstyles.label}>Your Location</Text>
                    <TextInput
                        style={dashboardstyles.input}
                        value={address}
                        editable={false}
                    />

                    <Text style={dashboardstyles.label}>Destination</Text>
                    <TextInput
                        style={dashboardstyles.input}
                        value={"2972 West Philippine Sea Rd. Santa Ana, Illinois 85486"}
                        editable={false}
                    />
                    
                    {lastUpdated && (
                        <Text style={dashboardstyles.lastUpdated}>
                            Last updated: {lastUpdated}
                        </Text>
                    )}
                    
                    <Text style={dashboardstyles.statusText}>
                        Status: {locationUpdateStatus}
                    </Text>
                    
                    <View style={loginstyle.toggleRow}>
                        <Text style={loginstyle.locationText}>
                            Location Updates ({updateInterval}s): {locationEnabled ? "On" : "Off"}
                        </Text>
                        <Switch value={locationEnabled} onValueChange={handleLocationToggle} />
                    </View>

                    <View style={loginstyle.toggleRow}>
                        <Text style={loginstyle.locationText}>Sensor: {sensorEnabled ? "GPS Sensor" : "Cell Tower + WiFi"}</Text>
                        <Switch value={sensorEnabled} onValueChange={(value) => setSensorEnabled(value)} />
                    </View>
                </View>
            </ScrollView>

            <View style={navbar.bottomNav2}>
                <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
                    <Image source={homeIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Trips", { userId, tripId, truckId })}>
                    <Image source={userIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Profile", { userId, email })}>
                    <Image source={profileicon} style={navbar.navIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Dashboard;