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
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { dashboardstyles } from "../styles/dashboardcss";
import { PermissionsAndroid, Linking } from 'react-native';
import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import profileicon from "../assets/profile.png";
import LocationService from "../services/LocationService";

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
    const [locationUpdateStatus, setLocationUpdateStatus] = useState('Idle');
    const [heading, setHeading] = useState(0);

    const currentUser = auth().currentUser;
    const userId = currentUser?.uid || route.params?.userId || 'guest_user';
    const email = currentUser?.email || route.params?.email || 'guest@example.com';
    const driverName = currentUser?.displayName || route.params?.driverName || email.split('@')[0];

    const tripId = route.params?.tripId || `trip_${Date.now()}`;
    const truckId = route.params?.truckId || `truck_${Date.now()}`;

    // Location service listener callback
    const handleLocationUpdate = useCallback((data) => {
        if (data.status) {
            setLocationUpdateStatus(data.status);
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

    useEffect(() => {
        LocationService.addListener(handleLocationUpdate);
        
        const status = LocationService.getTrackingStatus();
        setLocationEnabled(status.isTracking);
        setSensorEnabled(status.sensorEnabled);
        setUpdateInterval(status.updateInterval);

        if (status.isTracking) {
            setLocationUpdateStatus('Tracking');
        }

        return () => {
            LocationService.removeListener(handleLocationUpdate);
        };
    }, [handleLocationUpdate]);

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
                        }
                    }
                ]
            );
        } else {
            LocationService.stopTracking();
            setLocationEnabled(false);
        }
    };

    const handleSensorToggle = (value) => {
        setSensorEnabled(value);
        if (locationEnabled) {
            LocationService.updateSettings(updateInterval, value);
        }
    };

    return (
        <View style={dashboardstyles.mainContainer}>
            {/* Header Section */}
            <View style={dashboardstyles.headerSection}>
                <View style={dashboardstyles.headerGradient}>
                    <Text style={dashboardstyles.welcomeText}>Welcome back,</Text>
                    <Text style={dashboardstyles.driverName}>{driverName}</Text>
                    <View style={dashboardstyles.statusBadge}>
                        <View style={[dashboardstyles.statusDot, { backgroundColor: locationEnabled ? '#4CAF50' : '#FF5722' }]} />
                        <Text style={dashboardstyles.statusBadgeText}>
                            {locationUpdateStatus}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView 
                style={dashboardstyles.scrollContainer}
                contentContainerStyle={dashboardstyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Location Cards */}
                <View style={dashboardstyles.locationSection}>
                    <View style={dashboardstyles.locationCard}>
                        <View style={dashboardstyles.cardHeader}>
                            <View style={dashboardstyles.locationIcon}>
                                <Text style={dashboardstyles.locationIconText}>📍</Text>
                            </View>
                            <Text style={dashboardstyles.cardTitle}>Current Location</Text>
                        </View>
                        <Text style={dashboardstyles.addressText}>{address}</Text>
                        {lastUpdated && (
                            <Text style={dashboardstyles.lastUpdatedText}>
                                Last updated: {lastUpdated}
                            </Text>
                        )}
                    </View>

                    <View style={dashboardstyles.locationCard}>
                        <View style={dashboardstyles.cardHeader}>
                            <View style={dashboardstyles.destinationIcon}>
                                <Text style={dashboardstyles.locationIconText}>🎯</Text>
                            </View>
                            <Text style={dashboardstyles.cardTitle}>Destination</Text>
                        </View>
                        <Text style={dashboardstyles.addressText}>
                            2972 West Philippine Sea Rd. Santa Ana, Illinois 85486
                        </Text>
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
                                    Updates every {updateInterval} seconds
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

                    <View style={dashboardstyles.controlCard}>
                        <View style={dashboardstyles.controlHeader}>
                            <View style={dashboardstyles.controlInfo}>
                                <Text style={dashboardstyles.controlTitle}>Location Method</Text>
                                <Text style={dashboardstyles.controlSubtitle}>
                                    {sensorEnabled ? "GPS Sensor (High Accuracy)" : "Cell Tower + WiFi (Battery Saver)"}
                                </Text>
                            </View>
                            <Switch 
                                value={sensorEnabled} 
                                onValueChange={handleSensorToggle}
                                trackColor={{ false: "#E0E0E0", true: "#81C784" }}
                                thumbColor={sensorEnabled ? "#4CAF50" : "#BDBDBD"}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={navbar.bottomNav2}>
                <TouchableOpacity 
                    onPress={() => nav.navigate("Dashboard")}
                    style={dashboardstyles.navButton}
                >
                    <Image source={homeIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => nav.navigate("Trips", { userId, tripId, truckId })}
                    style={dashboardstyles.navButton}
                >
                    <Image source={userIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => nav.navigate("Profile", { userId, email })}
                    style={dashboardstyles.navButton}
                >
                    <Image source={profileicon} style={navbar.navIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Dashboard;