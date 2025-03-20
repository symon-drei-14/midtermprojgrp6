import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { profilestyle } from "../styles/Profilecss";
import { navbar } from "../styles/Navbar";
import userIcon2 from "../assets/profile.png";
import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import profileicon from "../assets/profile.png";

const Profile = () => {
    const nav = useNavigation();
    const [password, setPassword] = useState(""); 
    const [savedPassword, setSavedPassword] = useState("password123");
    const [passwordError, setPasswordError] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false); // Toggle password visibility in modal

    const handleLogout = () => {
        nav.navigate("Login");
    };

    const validatePassword = (text) => {
        setPassword(text);
        setPasswordError(text.trim() === "" ? "Password is required." : text.length < 8 ? "Password must be at least 8 characters." : "");
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
        setSavedPassword(password);
        setModalVisible(false);
        alert("Password updated successfully!");
    };

    return (
        <View style={profilestyle.container}>
       
            <View style={profilestyle.avatarContainer}>
                <Image source={userIcon2} style={profilestyle.avatar} />
            </View>

           
            <View style={profilestyle.infoCard}>
                <View style={profilestyle.infoRow}><Text>Name: Lebron James</Text></View>
                <View style={profilestyle.infoRow}><Text>Email: Lebronjames@gmail.com</Text></View>

      
                <View style={[profilestyle.infoRow, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
                    <Text>Password: {showPassword ? savedPassword : "******"}</Text>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={profilestyle.toggleButton}>
                        <Text style={profilestyle.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={profilestyle.infoRow}><Text>Contact no: 0912341266</Text></View>
                <View style={profilestyle.infoRow}><Text>Status: Active</Text></View>
            </View>

            {/* Buttons */}
            <View style={profilestyle.buttonContainer}>
            <TouchableOpacity onPress={() => {setPassword(savedPassword); 
            setModalVisible(true);
    }} 
    style={profilestyle.changePasswordButton}>
    <Text style={profilestyle.buttonText}>Change Password</Text>
</TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={profilestyle.logoutButton}>
                    <Text style={profilestyle.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Changing Password */}
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
