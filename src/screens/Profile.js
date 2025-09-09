import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { profilestyle } from "../styles/Profilecss";
import { navbar } from "../styles/Navbar";
import userIcon2 from "../assets/profile.png";
import homeIcon from "../assets/Home.png";
import userIcon from "../assets/trip.png";
import profileicon from "../assets/user.png";
import profilepic from "../assets/prof.png";
import LocationService from "../services/LocationService"; // Import the location service
import { useNavigationState } from "@react-navigation/native";
import { tripstyle } from "../styles/Tripcss";

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
    const state = useNavigationState((state) => state);
    const currentRoute = state.routes[state.index].name;
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
            <ScrollView contentContainerStyle={profilestyle.scrollContainer}>
                {/* Profile Header */}
                <View style={profilestyle.profileHeader}>
                    <View style={profilestyle.avatarContainer}>
                        <Text style={profilestyle.avatar}>👻</Text>
                        <TouchableOpacity style={profilestyle.editIcon}>
                            <Text style={profilestyle.editIconText}>📷</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={profilestyle.name}>{driverName || "Lebron James"}</Text>
                    <Text style={profilestyle.email}>{email || "lebronjames@gmail.com"}</Text>
                </View>

                {/* Info Card */}
                <View style={profilestyle.infoCard}>
                    <View style={profilestyle.cardHeader}>
                        <Text style={profilestyle.icon}>ℹ️</Text>
                        <Text style={profilestyle.cardTitle}>Driver Information</Text>
                    </View>

                    <View style={profilestyle.infoItem}>
                        <Text style={profilestyle.icon}>📞</Text>
                        <Text style={profilestyle.infoText}>0912341266</Text>
                    </View>

                    <View style={profilestyle.infoItem}>
                        <Text style={profilestyle.icon}>🛡️</Text>
                        <Text style={profilestyle.infoText}>Status: Active</Text>
                    </View>

                    <View style={profilestyle.infoItem}>
                        <Text style={profilestyle.icon}>📍</Text>
                        <Text style={profilestyle.infoText}>Location Tracking: </Text>
                        <Text style={[profilestyle.infoText, { 
                            color: isLocationTracking ? '#4CAF50' : '#a11b1bff',
                            fontWeight: 'bold'
                        }]}>
                            {isLocationTracking ? `ON (${locationStatus})` : 'OFF'}
                        </Text>
                    </View>

                    <View style={profilestyle.passwordItem}>
                        <Text style={profilestyle.icon}>🔒</Text>
                        <Text style={profilestyle.infoText}>Password: {showPassword ? savedPassword2 : "••••••••"}</Text>
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)} 
                            style={profilestyle.toggleButton}>
                            <Text style={profilestyle.toggleText}>{showPassword ? "🙈" : "👁️"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={profilestyle.actionButtons}>
                    <TouchableOpacity 
                        onPress={() => {
                            setPassword("");
                            setPassword2("");
                            setPasswordError("");
                            setConfirmPasswordError("");
                            setModalVisible(true);
                        }} 
                        style={profilestyle.primaryButton}>
                        <Text style={profilestyle.buttonIcon}>🔑</Text>
                        <Text style={profilestyle.primaryButtonText}>Change Password</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={handleLogout} 
                        style={[profilestyle.secondaryButton, isLoggingOut && { opacity: 0.6 }]}
                        disabled={isLoggingOut}>
                        <Text style={profilestyle.buttonIcon}>🚪</Text>
                        <Text style={profilestyle.secondaryButtonText}>
                            {isLoggingOut ? "Logging out..." : "Log Out"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Password Change Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                {/* ... [keep your existing modal code] ... */}
            </Modal>

            {/* Bottom Navigation */}
            <View style={navbar.bottomNav2}>
                {/* ... [keep your existing bottom nav code] ... */}
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

{/* Bottom Navigation */}
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

export default Profile;