import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { profilestyle } from "../styles/Profilecss";
import { tripstyle } from "../styles/Tripcss";
import LocationService from "../services/LocationService";
import { useNavigationState } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ route }) => {
    const nav = useNavigation();
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPassword2, setShowNewPassword2] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const state = useNavigationState((state) => state);
    const currentRoute = state.routes[state.index].name;
    const [locationStatus, setLocationStatus] = useState('Idle');
    const [isLocationTracking, setIsLocationTracking] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [driverInfo, setDriverInfo] = useState({
        name: "",
        email: "",
        contact_no: ""
    });
    const [tempDriverInfo, setTempDriverInfo] = useState({
        name: "",
        email: "",
        contact_no: ""
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const API_BASE_URL = 'http://192.168.1.4/capstone-1-eb';

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
        // Load driver info from AsyncStorage or route params
        const loadDriverInfo = async () => {
            try {
                const sessionData = await AsyncStorage.getItem('userSession');
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    setDriverInfo({
                        name: session.driverName || driverName || "Lebron James",
                        email: session.email || email || "lebronjames@gmail.com",
                        contact_no: session.contact_no || "0912341266"
                    });
                } else if (driverName || email) {
                    setDriverInfo({
                        name: driverName || "Lebron James",
                        email: email || "lebronjames@gmail.com",
                        contact_no: "0912341266"
                    });
                }
            } catch (error) {
                console.error('Error loading driver info:', error);
            }
        };

        loadDriverInfo();

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
    }, [handleLocationUpdate, driverName, email]);

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

    const handleSavePassword = async () => {
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

        setIsChangingPassword(true);
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (!sessionData) {
                throw new Error("No session data found");
            }

            const session = JSON.parse(sessionData);
            const driverId = session.userId;

            const response = await fetch(`${API_BASE_URL}/include/handlers/update_mobile_driver.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    driver_id: driverId,
                    password: password
                }),
            });

            const data = await response.json();

            if (data.success) {
                setModalVisible(false);
                setPassword("");
                setPassword2("");
                Alert.alert("Success", "Password updated successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to update password.");
            }
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert("Error", "Failed to update password. Please try again.");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const openEditModal = () => {
        setTempDriverInfo(driverInfo);
        setEditModalVisible(true);
    };

    const handleSaveProfile = async () => {
        if (!tempDriverInfo.name.trim()) {
            Alert.alert("Error", "Name is required.");
            return;
        }
        if (!tempDriverInfo.email.trim()) {
            Alert.alert("Error", "Email is required.");
            return;
        }
        if (!tempDriverInfo.contact_no.trim()) {
            Alert.alert("Error", "Contact number is required.");
            return;
        }

        setIsUpdating(true);
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (!sessionData) {
                throw new Error("No session data found");
            }

            const session = JSON.parse(sessionData);
            const driverId = session.userId;

            const response = await fetch(`${API_BASE_URL}/include/handlers/update_mobile_driver.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    driver_id: driverId,
                    name: tempDriverInfo.name,
                    email: tempDriverInfo.email,
                    contact_no: tempDriverInfo.contact_no
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setDriverInfo(tempDriverInfo);
               
                // Update AsyncStorage session
                const updatedSession = {
                    ...session,
                    driverName: tempDriverInfo.name,
                    email: tempDriverInfo.email,
                    contact_no: tempDriverInfo.contact_no
                };
                await AsyncStorage.setItem('userSession', JSON.stringify(updatedSession));
               
                setEditModalVisible(false);
                Alert.alert("Success", "Profile updated successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <View style={profilestyle.container}>
            <ScrollView contentContainerStyle={profilestyle.scrollContainer}>
                {/* Profile Header */}
                <View style={profilestyle.profileHeader}>
                    <View style={profilestyle.avatarContainer}>
                        <Text style={profilestyle.avatar}>👻</Text>
                        <TouchableOpacity style={profilestyle.editIcon} onPress={openEditModal}>
                            <Text style={profilestyle.editIconText}>✏️</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={profilestyle.name}>{driverInfo.name}</Text>
                    <Text style={profilestyle.email}>{driverInfo.email}</Text>
                </View>

                {/* Info Card */}
                <View style={profilestyle.infoCard}>
                    <View style={profilestyle.cardHeader}>
                        <Text style={profilestyle.icon}>ℹ️</Text>
                        <Text style={profilestyle.cardTitle}>Driver Information</Text>
                    </View>

                    <View style={profilestyle.infoItem}>
                        <Text style={profilestyle.icon}>📞</Text>
                        <Text style={profilestyle.infoText}>{driverInfo.contact_no}</Text>
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
                        <Text style={profilestyle.infoText}>Password: ••••••••</Text>
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
                            <TouchableOpacity 
                                onPress={handleSavePassword} 
                                style={[profilestyle.saveButton, isChangingPassword && { opacity: 0.6 }]}
                                disabled={isChangingPassword}>
                                <Text style={profilestyle.buttonText}>
                                    {isChangingPassword ? "Saving..." : "Save"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)} 
                                style={profilestyle.cancelButton}
                                disabled={isChangingPassword}>
                                <Text style={profilestyle.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal visible={editModalVisible} transparent animationType="slide">
                <View style={profilestyle.modalContainer}>
                    <View style={profilestyle.modalContent}>
                        <Text style={profilestyle.modalTitle}>Edit Profile</Text>

                        <View style={profilestyle.inputContainer}>
                            <Text style={profilestyle.inputLabel}>Name</Text>
                            <TextInput
                                style={profilestyle.input}
                                placeholder="Enter your name"
                                value={tempDriverInfo.name}
                                onChangeText={(text) => setTempDriverInfo({...tempDriverInfo, name: text})}
                            />
                        </View>

                        <View style={profilestyle.inputContainer}>
                            <Text style={profilestyle.inputLabel}>Email</Text>
                            <TextInput
                                style={profilestyle.input}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                value={tempDriverInfo.email}
                                onChangeText={(text) => setTempDriverInfo({...tempDriverInfo, email: text})}
                            />
                        </View>

                        <View style={profilestyle.inputContainer}>
                            <Text style={profilestyle.inputLabel}>Contact Number</Text>
                            <TextInput
                                style={profilestyle.input}
                                placeholder="Enter your contact number"
                                keyboardType="phone-pad"
                                value={tempDriverInfo.contact_no}
                                onChangeText={(text) => setTempDriverInfo({...tempDriverInfo, contact_no: text})}
                            />
                        </View>
                       
                        <View style={profilestyle.modalButtonContainer}>
                            <TouchableOpacity
                                onPress={handleSaveProfile}
                                style={[profilestyle.saveButton, isUpdating && { opacity: 0.6 }]}
                                disabled={isUpdating}
                            >
                                <Text style={profilestyle.buttonText}>
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setEditModalVisible(false)}
                                style={profilestyle.cancelButton}
                            >
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