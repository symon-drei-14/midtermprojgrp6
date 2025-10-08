import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Alert, ScrollView, ActivityIndicator, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { profilestyle } from "../styles/Profilecss";
import { tripstyle } from "../styles/Tripcss";
import LocationService from "../services/LocationService";
import { useNavigationState } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker
import Icon from 'react-native-vector-icons/Feather';
import NotificationService from '../services/NotificationService';
import { API_BASE_URL } from '@env';

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

    // New states for OTP flow
    const [otp, setOtp] = useState("");
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

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


    const { onLogout } = route.params || {};

    const handleLocationUpdate = useCallback((data) => {
        if (data.status) {
            setLocationStatus(data.status);
        }
        if (data.isTracking !== undefined) {
            setIsLocationTracking(data.isTracking);
        }
    }, []);
    
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
                const driverData = {
                    ...data.driver,
                    driver_id: session.userId // Ensure driver_id is present
                };
                setDriverInfo(driverData);
                
                const updatedSession = { ...session, ...driverData };
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
            formData.append('old_password', oldPassword);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/include/handlers/update_mobile_driver.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                if (data.otp_required) {
                    setModalVisible(false);
                    setOtpModalVisible(true);
                    Alert.alert("Verification Required", data.message);
                } else {
                    setModalVisible(false);
                    setOldPassword("");
                    setPassword("");
                    setPassword2("");
                    Alert.alert("Success", "Password updated successfully!");
                }
            } else {
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
        setSelectedImage(null);
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
                if (data.otp_required) {
                    setEditModalVisible(false);
                    setOtpModalVisible(true);
                    Alert.alert("Verification Required", data.message);
                } else {
                    const updatedDriver = data.updated_driver;
                    setDriverInfo(updatedDriver); 
                    
                    const updatedSession = { ...session, ...updatedDriver };
                    await AsyncStorage.setItem('userSession', JSON.stringify(updatedSession));
                    
                    setEditModalVisible(false);
                    Alert.alert("Success", "Profile updated successfully!");
                }
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
    
    // This function is called when the user submits the OTP
    const handleFinalizeUpdateWithOtp = async () => {
        Keyboard.dismiss();
        if (!otp.trim() || otp.length !== 6) {
            Alert.alert("Invalid OTP", "Please enter the 6-digit code sent to your email.");
            return;
        }

        setIsVerifyingOtp(true);
        try {
            const sessionData = await AsyncStorage.getItem('userSession');
            if (!sessionData) throw new Error("No session found");
            
            const session = JSON.parse(sessionData);
            const driverId = session.userId;

            const formData = new FormData();
            formData.append('driver_id', driverId);
            formData.append('otp', otp);

            const response = await fetch(`${API_BASE_URL}/include/handlers/update_mobile_driver.php`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setOtpModalVisible(false);
                setOtp("");
                Alert.alert("Success", "Your information has been updated successfully!");
                // Refresh all driver data from the server
                await fetchDriverData(); 
            } else {
                Alert.alert("Error", data.message || "Invalid OTP or request failed.");
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            Alert.alert("Error", "An unexpected error occurred during OTP verification.");
        } finally {
            setIsVerifyingOtp(false);
        }
    };


    const fetchUnreadCount = useCallback(async () => {
    if (!driverInfo?.driver_id) return;
    
    try {
        console.log('Profile: Fetching unread count for driver:', driverInfo.driver_id);
        const count = await NotificationService.getUnreadCount(driverInfo.driver_id);
        console.log('Profile: Unread count received:', count);
        setUnreadCount(count);
    } catch (error) {
        console.error('Profile: Error fetching unread count:', error);
    }
}, [driverInfo?.driver_id]);

const handleNotificationEvent = useCallback((event) => {
    console.log('Profile: Notification event received:', event);
    
    switch (event.type) {
        case 'foreground_message':
        case 'notification_received':
            if (driverInfo?.driver_id) {
                console.log('Profile: Refreshing unread count...');
                fetchUnreadCount();
            }
            break;
            
        case 'navigate_to_trip':
            nav.navigate('Trips');
            break;
    }
}, [driverInfo?.driver_id, nav, fetchUnreadCount]);

useEffect(() => {
    if (!driverInfo?.driver_id) return;
    
    const initializeNotifications = async () => {
        try {
            console.log('Profile: Initializing notifications for driver:', driverInfo.driver_id);
            await NotificationService.initialize();
            await NotificationService.registerTokenWithBackend(driverInfo.driver_id);
            await fetchUnreadCount();
            
            NotificationService.addListener(handleNotificationEvent);
        } catch (error) {
            console.error('Profile: Error initializing notifications:', error);
        }
    };
    
    initializeNotifications();
    
    return () => {
        console.log('Profile: Cleaning up notification listener');
        NotificationService.removeListener(handleNotificationEvent);
    };
}, [driverInfo?.driver_id, handleNotificationEvent, fetchUnreadCount]);

useEffect(() => {
    if (!driverInfo?.driver_id) return;

    console.log('Profile: Setting up polling interval');
    const interval = setInterval(() => {
        console.log('Profile: Polling unread count...');
        fetchUnreadCount();
    }, 30000);

    return () => {
        console.log('Profile: Clearing polling interval');
        clearInterval(interval);
    };
}, [driverInfo?.driver_id, fetchUnreadCount]);
    
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

                <View style={profilestyle.infoCard}>
                    <View style={profilestyle.cardHeader}>
                        <Icon name="info" size={20} color="#3B82F6" />
                        <Text style={profilestyle.cardTitle}>Driver Information</Text>
                    </View>
                    <View style={profilestyle.infoItem}>
                        <Icon name="phone" size={20} color="#6B7280" style={{ marginRight: 16, width: 24 }} />
                        <Text style={profilestyle.infoText}>{driverInfo.contact_no}</Text>
                    </View>
                    <View style={profilestyle.infoItem}>
                        <Icon name="shield" size={20} color="#6B7280" style={{ marginRight: 16, width: 24 }} />
                        <Text style={profilestyle.infoLabel}>Status:</Text>
                        <View style={profilestyle.statusBadge}>
                            <Text style={profilestyle.statusText}>Active</Text>
                        </View>
                    </View>
                    <View style={profilestyle.infoItem}>
                        <Icon name="map-pin" size={20} color="#6B7280" style={{ marginRight: 16, width: 24 }} />
                        <Text style={profilestyle.infoLabel}>Location Tracking:</Text>
                        <View style={[profilestyle.trackingBadge, isLocationTracking ? profilestyle.trackingOnBadge : profilestyle.trackingOffBadge]}>
                            <Text style={[profilestyle.trackingText, { color: isLocationTracking ? '#059669' : '#dc2626' }]}>
                                {isLocationTracking ? 'ON' : 'OFF'}
                            </Text>
                        </View>
                    </View>
                    <View style={profilestyle.passwordItem}>
                        <Icon name="lock" size={20} color="#6B7280" style={{ marginRight: 16, width: 24 }} />
                        <Text style={profilestyle.infoLabel}>Password:</Text>
                        <Text style={profilestyle.infoText}>••••••••</Text>
                    </View>
                </View>

                <View style={profilestyle.actionButtons}>
                    <TouchableOpacity
                        onPress={() => {
                            setPassword(""); setPassword2(""); setPasswordError("");
                            setConfirmPasswordError(""); setModalVisible(true);
                        }}
                        style={profilestyle.primaryButton}>
                        <Icon name="key" size={16} color="#fff" /> 
                        <Text style={profilestyle.primaryButtonText}>Change Password</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={[profilestyle.secondaryButton, isLoggingOut && { opacity: 0.6 }]}
                        disabled={isLoggingOut}>
                        <Icon name="log-out" size={16} color="#fff" />
                        <Text style={profilestyle.secondaryButtonText}>
                            {isLoggingOut ? "Logging out..." : "Log Out"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        <Modal visible={modalVisible} transparent animationType="slide">
        <View style={profilestyle.modalContainer}>
            <View style={profilestyle.modalContent}>
                <Text style={profilestyle.modalTitle}>Change Password</Text>
            
                <Text style={profilestyle.modalSubtitle}>
                    Please enter your current password to set a new one.
                </Text>
                
                <Text style={profilestyle.inputLabel}>Current Password</Text>
                <View style={[profilestyle.passwordInputContainer, oldPasswordError && profilestyle.inputError]}>
                    <TextInput 
                        style={profilestyle.input} 
                        placeholder="Enter current password" 
                        secureTextEntry={!showOldPassword} 
                        value={oldPassword} 
                        onChangeText={validateOldPassword} 
                    />
                    <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={profilestyle.toggleButton}>
                        <Icon name={showOldPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>
                {oldPasswordError ? <Text style={profilestyle.errorText}>{oldPasswordError}</Text> : <View style={{ marginBottom: 12 }} />}

                <Text style={profilestyle.inputLabel}>New Password</Text>
                <View style={[profilestyle.passwordInputContainer, passwordError && profilestyle.inputError]}>
                    <TextInput 
                        style={profilestyle.input} 
                        placeholder="Enter new password" 
                        secureTextEntry={!showNewPassword} 
                        value={password} 
                        onChangeText={validatePassword} 
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={profilestyle.toggleButton}>
                        <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={profilestyle.errorText}>{passwordError}</Text> : <View style={{ marginBottom: 12 }} />}
                
                <Text style={profilestyle.inputLabel}>Confirm New Password</Text>
                <View style={[profilestyle.passwordInputContainer, confirmPasswordError && profilestyle.inputError]}>
                    <TextInput 
                        style={profilestyle.input}
                        placeholder="Confirm New Password" 
                        secureTextEntry={!showNewPassword2} 
                        value={password2} 
                        onChangeText={(text) => validateConfirmPassword(text)} 
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword2(!showNewPassword2)} style={profilestyle.toggleButton}>
                        <Icon name={showNewPassword2 ? "eye-off" : "eye"} size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>
                {confirmPasswordError ? <Text style={profilestyle.errorText}>{confirmPasswordError}</Text> : null}
                
                <View style={profilestyle.modalButtonContainer}>
                    <TouchableOpacity 
                        onPress={() => setModalVisible(false)} 
                        style={profilestyle.cancelButton} 
                        disabled={isChangingPassword}
                    >
                        <Text style={profilestyle.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={handleSavePassword} 
                        style={[profilestyle.saveButton, isChangingPassword && profilestyle.disabledButton]} 
                        disabled={isChangingPassword}
                    >
                        {isChangingPassword ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={profilestyle.buttonText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </Modal>
            
            <Modal visible={otpModalVisible} transparent animationType="slide">
                <View style={profilestyle.modalContainer}>
                    <View style={profilestyle.modalContent}>
                        <Text style={profilestyle.modalTitle}>Enter Verification Code</Text>
                        <Text style={profilestyle.otpSubtitle}>A 6-digit code has been sent to your email address.</Text>

                        <TextInput
                            style={profilestyle.otpInput}
                            placeholder="Enter OTP"
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                        />

                        <View style={profilestyle.modalButtonContainer}>
                            <TouchableOpacity
                                onPress={handleFinalizeUpdateWithOtp}
                                style={[profilestyle.saveButton, isVerifyingOtp && { opacity: 0.6 }]}
                                disabled={isVerifyingOtp}
                            >
                                {isVerifyingOtp ? <ActivityIndicator color="#fff" /> : <Text style={profilestyle.buttonText}>Verify & Save</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setOtpModalVisible(false); setOtp(""); }}
                                style={profilestyle.cancelButton}
                                disabled={isVerifyingOtp}
                            >
                                <Text style={profilestyle.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={editModalVisible} transparent animationType="slide">
                <View style={profilestyle.modalContainer}>
                    <ScrollView style={{width: '90%'}} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
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
                    </ScrollView>
                </View>
            </Modal>

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
};

export default Profile;
