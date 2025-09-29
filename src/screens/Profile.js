import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { profilestyle } from "../styles/Profilecss";
import { tripstyle } from "../styles/Tripcss";
import LocationService from "../services/LocationService";
import { useNavigationState } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker

const Profile = ({ route }) => {
    const nav = useNavigation();
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPassword2, setShowNewPassword2] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const state = useNavigationState((state) => state);
    const currentRoute = state.routes[state.index].name;
    const [locationStatus, setLocationStatus] = useState('Idle');
    const [isLocationTracking, setIsLocationTracking] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [driverInfo, setDriverInfo] = useState({
        name: "",
        email: "",
        contact_no: "",
        driver_pic: null 
    });

    const validateOldPassword = (text) => {
    setOldPassword(text);
    if (text.trim() === "") {
        setOldPasswordError("Current password is required.");
    } else {
        setOldPasswordError("");
    }
};
    
    const [tempDriverInfo, setTempDriverInfo] = useState({
        name: "",
        email: "",
        contact_no: "",
        driver_pic: null
    });

    const [selectedImage, setSelectedImage] = useState(null); // To hold the newly selected image file
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const API_BASE_URL = 'http://192.168.1.4/capstone-1-eb';

    const { onLogout } = route.params || {};

    const handleLocationUpdate = useCallback((data) => {
        if (data.status) {
            setLocationStatus(data.status);
        }
        if (data.isTracking !== undefined) {
            setIsLocationTracking(data.isTracking);
        }
    }, []);
    
    // Function to fetch the latest driver data from the server
    const fetchDriverData = async () => {
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const response = await fetch(`${API_BASE_URL}/include/handlers/get_mobile_driver.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ driver_id: session.userId }),
                });
                const data = await response.json();
                if (data.success) {
                    setDriverInfo(data.driver);
                    // Also update async storage with the fresh data
                    const updatedSession = { ...session, ...data.driver };
                    await AsyncStorage.setItem('userSession', JSON.stringify(updatedSession));
                } else {
                    console.error('Failed to fetch driver data:', data.message);
                }
            }
        } catch (error) {
            console.error('Error in fetchDriverData:', error);
        }
    };
    
    useEffect(() => {
        fetchDriverData(); // Fetch fresh data on component mount

        LocationService.addListener(handleLocationUpdate);
        const status = LocationService.getTrackingStatus();
        setIsLocationTracking(status.isTracking);
        if (status.isTracking) {
            setLocationStatus('Tracking');
        }

        return () => {
            LocationService.removeListener(handleLocationUpdate);
        };
    }, [handleLocationUpdate]);

    const handleLogout = () => {
        Alert.alert( "Logout", "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout", style: "destructive",
                    onPress: async () => {
                        if (onLogout) {
                            setIsLoggingOut(true);
                            try {
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
    // Re-run all validations on submit attempt
    validateOldPassword(oldPassword);
    validatePassword(password);
    validateConfirmPassword(password2);

    // Check for any validation errors before proceeding
    if (!oldPassword.trim() || !password.trim() || password.length < 8 || password !== password2) {
        return; // Stop if any validation fails
    }

    setIsChangingPassword(true);
    try {
        const sessionData = await AsyncStorage.getItem('userSession');
        if (!sessionData) throw new Error("No session data found");

        const session = JSON.parse(sessionData);
        const driverId = session.userId;
        
        const formData = new FormData();
        formData.append('driver_id', driverId);
        formData.append('old_password', oldPassword); // Send the current password
        formData.append('password', password);       // This is the new password

        const response = await fetch(`${API_BASE_URL}/include/handlers/update_mobile_driver.php`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            setModalVisible(false);
            setOldPassword("");
            setPassword("");
            setPassword2("");
            Alert.alert("Success", "Password updated successfully!");
        } else {
            // Display the specific error from the server (e.g., "Incorrect current password")
            Alert.alert("Error", data.message || "Failed to update password.");
        }
    } catch (error) {
        console.error('Error updating password:', error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
        setIsChangingPassword(false);
    }
};

    const openEditModal = () => {
        setTempDriverInfo(driverInfo);
        setSelectedImage(null); // Reset selected image when opening modal
        setEditModalVisible(true);
    };
    
    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                setSelectedImage(response.assets[0]);
            }
        });
    };

    const handleSaveProfile = async () => {
        if (!tempDriverInfo.name.trim() || !tempDriverInfo.email.trim() || !tempDriverInfo.contact_no.trim()) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        setIsUpdating(true);
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (!sessionData) throw new Error("No session data found");

            const session = JSON.parse(sessionData);
            const driverId = session.userId;
            
            const formData = new FormData();
            formData.append('driver_id', driverId);
            formData.append('name', tempDriverInfo.name);
            formData.append('email', tempDriverInfo.email);
            formData.append('contact_no', tempDriverInfo.contact_no);

            if (selectedImage) {
                formData.append('driver_pic', {
                    uri: selectedImage.uri,
                    type: selectedImage.type,
                    name: selectedImage.fileName,
                });
            }

            const response = await fetch(`${API_BASE_URL}/include/handlers/update_mobile_driver.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                const updatedDriver = data.updated_driver;
                setDriverInfo(updatedDriver); // Update local state
                
                // Update AsyncStorage session
                const updatedSession = { ...session, ...updatedDriver };
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
    
    // Helper to render the profile picture or a placeholder
    const renderProfileImage = (style) => {
        if (driverInfo.driver_pic) {
            return <Image source={{ uri: `data:image/jpeg;base64,${driverInfo.driver_pic}` }} style={style} />;
        }
        return <Text style={profilestyle.avatar}>👻</Text>;
    };

    return (
        <View style={profilestyle.container}>
            <ScrollView contentContainerStyle={profilestyle.scrollContainer}>
                <View style={profilestyle.profileHeader}>
                    <View style={profilestyle.avatarContainer}>
                        {renderProfileImage(profilestyle.avatarImage)}
                        <TouchableOpacity style={profilestyle.editIcon} onPress={openEditModal}>
                            <Text style={profilestyle.editIconText}>✏️</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={profilestyle.name}>{driverInfo.name || "Loading..."}</Text>
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
                        <Text style={[profilestyle.infoText, { color: isLocationTracking ? '#4CAF50' : '#a11b1bff', fontWeight: 'bold' }]}>
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
                            setPassword(""); setPassword2(""); setPasswordError("");
                            setConfirmPasswordError(""); setModalVisible(true);
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
            
            {/* Current Password Input */}
            <View style={[profilestyle.passwordInputContainer, { flexDirection: "row", alignItems: "center" }]}>
                <TextInput 
                    style={[profilestyle.input, { flex: 1 }]} 
                    placeholder="Enter current password" 
                    secureTextEntry={!showOldPassword} 
                    value={oldPassword} 
                    onChangeText={validateOldPassword} 
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={profilestyle.toggleButton}>
                    <Text style={profilestyle.toggleText}>{showOldPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
            </View>
            {oldPasswordError ? <Text style={profilestyle.errorText}>{oldPasswordError}</Text> : null}

            {/* New Password Input */}
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
            
            {/* Confirm New Password Input */}
            <View style={[profilestyle.passwordInputContainer, { flexDirection: "row", alignItems: "center" }]}>
                <TextInput 
                    style={[profilestyle.input, { flex: 1 }]} 
                    placeholder="Confirm New Password" 
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
                    disabled={isChangingPassword}
                >
                    <Text style={profilestyle.buttonText}>{isChangingPassword ? "Saving..." : "Save"}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => setModalVisible(false)} 
                    style={profilestyle.cancelButton} 
                    disabled={isChangingPassword}
                >
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
                        
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <Image
                                source={selectedImage ? { uri: selectedImage.uri } : (tempDriverInfo.driver_pic ? { uri: `data:image/jpeg;base64,${tempDriverInfo.driver_pic}` } : require('../assets/user.png'))}
                                style={profilestyle.modalAvatarPreview}
                            />
                            <TouchableOpacity onPress={handleChoosePhoto} style={profilestyle.changePhotoButton}>
                                <Text style={profilestyle.changePhotoButtonText}>Change Photo</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={profilestyle.inputContainer}>
                            <Text style={profilestyle.inputLabel}>Name</Text>
                            <TextInput style={profilestyle.input} placeholder="Enter your name" value={tempDriverInfo.name} onChangeText={(text) => setTempDriverInfo({...tempDriverInfo, name: text})} />
                        </View>
                        <View style={profilestyle.inputContainer}>
                            <Text style={profilestyle.inputLabel}>Email</Text>
                            <TextInput style={profilestyle.input} placeholder="Enter your email" keyboardType="email-address" value={tempDriverInfo.email} onChangeText={(text) => setTempDriverInfo({...tempDriverInfo, email: text})} />
                        </View>
                        <View style={profilestyle.inputContainer}>
                            <Text style={profilestyle.inputLabel}>Contact Number</Text>
                            <TextInput style={profilestyle.input} placeholder="Enter your contact number" keyboardType="phone-pad" value={tempDriverInfo.contact_no} onChangeText={(text) => setTempDriverInfo({...tempDriverInfo, contact_no: text})} />
                        </View>
                        
                        <View style={profilestyle.modalButtonContainer}>
                            <TouchableOpacity onPress={handleSaveProfile} style={[profilestyle.saveButton, isUpdating && { opacity: 0.6 }]} disabled={isUpdating}>
                                {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={profilestyle.buttonText}>Save Changes</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={profilestyle.cancelButton}>
                                <Text style={profilestyle.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
};

export default Profile;