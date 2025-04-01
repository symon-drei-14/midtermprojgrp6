import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    Switch,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from "@react-navigation/native";
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { dashboardstyles } from "../styles/dashboardcss";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import profileicon from "../assets/profile.png";

function Dashboard({ route, navigation }) {
    const nav = useNavigation();
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [sensorEnabled, setSensorEnabled] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [databaseStatus, setDatabaseStatus] = useState("Not connected");
    const watchIdRef = useRef(null);
    const [address, setAddress] = useState("2972 Westheimer Rd. Santa Ana, Illinois 85486");

    const userId = route.params?.userId || 'test_driver_123';

    const tripId = route.params?.tripId || `trip_${Date.now()}`;

    const startLocationTracking = () => {
        const options = {
            enableHighAccuracy: sensorEnabled, 
            distanceFilter: 10, 
            interval: 5000, 
            fastestInterval: 2000 
        };

        try {
            watchIdRef.current = Geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const timestamp = position.timestamp;
                    
                    console.log(`New location: ${latitude}, ${longitude}`);
                    
                    setCurrentLocation({
                        latitude,
                        longitude,
                        timestamp
                    });

                    const useFirestore = databaseStatus.includes("Firestore");
                    if (useFirestore) {
                        storeLocationToFirestore(latitude, longitude, timestamp);
                    } else {
                        storeLocationToFirebase(latitude, longitude, timestamp);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    Alert.alert('Location Error', error.message);
                    setLocationEnabled(false);
                },
                options
            );
        } catch (error) {
            console.error('Failed to start location tracking:', error);
            Alert.alert('Error', `Could not start location tracking: ${error.message}`);
        }
    };

    const stopLocationTracking = () => {
        if (watchIdRef.current !== null) {
            Geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    const storeLocationToFirebase = (latitude, longitude, timestamp) => {
        const logId = `log_${Date.now()}`;
        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    
        database()
            .ref(`/location_logs/${logId}`)
            .set({
                log_id: logId,
                trip_id: tripId,
                driver_id: userId,
                latitude,
                longitude,
                timestamp: currentTime, 
                sensor_type: sensorEnabled ? 'gps' : 'network'
            })
            .then(() => {
                return database()
                    .ref(`/drivers/${userId}/current_location`)
                    .set({
                        latitude,
                        longitude,
                        timestamp: currentTime, 
                        trip_id: tripId
                    });
            })
            .then(() => setDatabaseStatus("Data stored successfully in Realtime DB"))
            .catch((error) => {
                console.error("Error saving location:", error);
                setDatabaseStatus(`Error: ${error.message}`);
            });
    };

    const handleLocationToggle = (value) => {
        if (value) {
            Alert.alert(
                "Enable Location?",
                "Do you want to allow location updates?",
                [
                    { text: "Cancel", style: "cancel", onPress: () => setLocationEnabled(false) },
                    { 
                        text: "Allow", 
                        onPress: () => {
                            setLocationEnabled(true);
                            startLocationTracking();
                        } 
                    }
                ]
            );
        } else {
            setLocationEnabled(false);
            stopLocationTracking();
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

                    <View style={loginstyle.toggleRow}>
                       <Text style={loginstyle.locationText}>Location Update: {locationEnabled ? "On" : "Off"}</Text>
                        <Switch value={locationEnabled} onValueChange={handleLocationToggle} />
                    </View>

                    <View style={loginstyle.toggleRow}>
                        <Text style={loginstyle.locationText}>Sensor: {sensorEnabled ? "GPS Sensor" : "Cell Tower + WiFi"}</Text>
                        <Switch value={sensorEnabled} onValueChange={(value) => setSensorEnabled(value)} />
                    </View>

                    <View style={{ marginVertical: 5 }} />

                    {locationEnabled && currentLocation && (
                        <>
                            <Text style={dashboardstyles.coordinates}>Longitude: {currentLocation.longitude.toFixed(6)}</Text>
                            <Text style={dashboardstyles.coordinates}>Latitude: {currentLocation.latitude.toFixed(6)}</Text>
                            <Text style={dashboardstyles.coordinates}>Last Updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}</Text>
                            <Text style={dashboardstyles.coordinates}>Trip ID: {tripId.substring(0, 12)}</Text>
                            <Text style={dashboardstyles.coordinates}>Driver ID: {userId}</Text>
                        </>
                    )}  
                </View>
            </ScrollView>

            <View style={navbar.bottomNav2}>
                <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
                    <Image source={homeIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Trips")}>
                    <Image source={userIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Profile")}>
                    <Image source={profileicon} style={navbar.navIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Dashboard;