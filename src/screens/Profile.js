import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { profilestyle } from "../styles/Profilecss";
import { navbar } from "../styles/Navbar";
import userIcon2 from "../assets/profile.png";
import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import profileicon from "../assets/profile.png";
import profilepic from "../assets/prof.png";
import LocationService from "../services/LocationService"; // Import the location service

const Profile = ({ route }) => {
    const nav = useNavigation();
    const [password, setPassword] = useState(""); 
    const [password2, setPassword2] = useState(""); 
    const [savedPassword, setSavedPassword] = useState("password123");
    const [savedPassword2, setSavedPassword2] = useState("password123");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false); 
    const [showPassword2, setShowPassword2] = useState(false);
    const [showNewPassword2, setShowNewPassword2] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // Location tracking status
    const [locationStatus, setLocationStatus] = useState('Idle');
    const [isLocationTracking, setIsLocationTracking] = useState(false);

    const { onLogout, driverName, email } = route.params || {};

    // Location service listener callback
    const handleLocationUpdate = useCallback((data) => {
        if (data.status) {
            setLocationStatus(data.status);
        }
        if (data.isTracking !== undefined) {
            setIsLocationTracking(data.isTracking);
        }
    }, []);

    useEffect(() => {
        // Add listener to location service
        LocationService.addListener(handleLocationUpdate);
        
        // Get initial tracking status
        const status = LocationService.getTrackingStatus();
        setIsLocationTracking(status.isTracking);
        if (status.isTracking) {
            setLocationStatus('Tracking');
        }

        // Clean up listener on unmount
        return () => {
            LocationService.removeListener(handleLocationUpdate);
        };
    }, [handleLocationUpdate]);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        if (onLogout) {
                            setIsLoggingOut(true);
                            try {
                                // Stop location tracking when logging out
                                if (isLocationTracking) {
                                    LocationService.stopTracking();
                                }
                                await onLogout();
                            } catch (error) {
                                console.error('Logout error:', error);
                                Alert.alert("Error", "Failed to logout. Please try again.");
                            } finally {
                                setIsLoggingOut(false);
                            }
                        } else {
                            console.warn("onLogout function not available");
                            nav.navigate("Login");
                        }
                    }
                }
            ]
        );
    };

    const validatePassword = (text) => {
        setPassword(text);
        setPasswordError(text.trim() === "" ? "Password is required." : text.length < 8 ? "Password must be at least 8 characters." : "");
        
        if (password2) {
            validateConfirmPassword(password2, text);
        }
    };

    const validateConfirmPassword = (confirmText, newPassword = password) => {
        setPassword2(confirmText);
        
        if (!confirmText.trim()) {
            setConfirmPasswordError("Confirm password is required.");
        } else if (confirmText !== newPassword) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleSave = () => {
        if (!password.trim()) {
            setPasswordError("Password is required.");
            return;
        }
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }
        
        if (!password2.trim()) {
            setConfirmPasswordError("Confirm password is required.");
            return;
        }
        if (password !== password2) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }
        
        setSavedPassword(password);
        setSavedPassword2(password);
        setModalVisible(false);
        Alert.alert("Success", "Password updated successfully!");
    };

    return (
        <View style={profilestyle.container}>
            <View style={profilestyle.avatarContainer}>
                <Image source={profilepic} style={profilestyle.avatar} />
            </View>

            <View style={profilestyle.infoCard}>
                <View style={profilestyle.infoRow}>
                    <Text>Name: {driverName || "Lebron James"}</Text>
                </View>
                <View style={profilestyle.infoRow}>
                    <Text>Email: {email || "Lebronjames@gmail.com"}</Text>
                </View>

                <View style={[profilestyle.infoRow, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
                    <Text>Password: {showPassword ? savedPassword2 : "******"}</Text>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={profilestyle.toggleButton}>
                        <Text style={profilestyle.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={profilestyle.infoRow}><Text>Contact no: 0912341266</Text></View>
                <View style={profilestyle.infoRow}><Text>Status: Active</Text></View>
                
                {/* Location tracking status */}
                <View style={profilestyle.infoRow}>
                    <Text>Location Tracking: </Text>
                    <Text style={{ 
                        color: isLocationTracking ? '#4CAF50' : '#757575',
                        fontWeight: 'bold'
                    }}>
                        {isLocationTracking ? `ON (${locationStatus})` : 'OFF'}
                    </Text>
                </View>
            </View>

            <View style={profilestyle.buttonContainer}>
                <TouchableOpacity 
                    onPress={() => {
                        setPassword("");
                        setPassword2("");
                        setPasswordError("");
                        setConfirmPasswordError("");
                        setModalVisible(true);
                    }} 
                    style={profilestyle.changePasswordButton}>
                    <Text style={profilestyle.buttonText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleLogout} 
                    style={[profilestyle.logoutButton, isLoggingOut && { opacity: 0.6 }]}
                    disabled={isLoggingOut}>
                    <Text style={profilestyle.buttonText}>
                        {isLoggingOut ? "Logging out..." : "Log Out"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={profilestyle.modalContainer}>
                    <View style={profilestyle.modalContent}>
                        <Text style={profilestyle.modalTitle}>Change Password</Text>

                        <View style={[profilestyle.passwordInputContainer, { flexDirection: "row", alignItems: "center" }]}>
                            <TextInput
                                style={[profilestyle.input, { flex: 1 }]}
                                placeholder="Enter new password"
                                secureTextEntry={!showNewPassword}
                                value={password}
                                onChangeText={validatePassword}
                            />
                            
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={profilestyle.toggleButton}>
                                <Text style={profilestyle.toggleText}>{showNewPassword ? "Hide" : "Show"}</Text>
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={profilestyle.errorText}>{passwordError}</Text> : null}

                        <View style={[profilestyle.passwordInputContainer, { flexDirection: "row", alignItems: "center" }]}>
                            <TextInput
                                style={[profilestyle.input, { flex: 1 }]}
                                placeholder="Confirm Password"
                                secureTextEntry={!showNewPassword2}
                                value={password2}
                                onChangeText={(text) => validateConfirmPassword(text)}
                            />
                            
                            <TouchableOpacity onPress={() => setShowNewPassword2(!showNewPassword2)} style={profilestyle.toggleButton}>
                                <Text style={profilestyle.toggleText}>{showNewPassword2 ? "Hide" : "Show"}</Text>
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={profilestyle.errorText}>{confirmPasswordError}</Text> : null}
                        
                        <View style={profilestyle.modalButtonContainer}>
                            <TouchableOpacity onPress={handleSave} style={profilestyle.saveButton}>
                                <Text style={profilestyle.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={profilestyle.cancelButton}>
                                <Text style={profilestyle.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
};

export default Profile;