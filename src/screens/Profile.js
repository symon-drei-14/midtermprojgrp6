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
import profilepic from "../assets/prof.png";

const Profile = () => {
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

    const handleLogout = () => {
        nav.navigate("Login");
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
        alert("Password updated successfully!");
    };

    return (
        <View style={profilestyle.container}>
       
            <View style={profilestyle.avatarContainer}>
                <Image source={profilepic} style={profilestyle.avatar} />
            </View>

           
            <View style={profilestyle.infoCard}>
                <View style={profilestyle.infoRow}><Text>Name: Lebron James</Text></View>
                <View style={profilestyle.infoRow}><Text>Email: Lebronjames@gmail.com</Text></View>

      
                <View style={[profilestyle.infoRow, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
                    <Text>Password: {showPassword ? savedPassword2 : "******"}</Text>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={profilestyle.toggleButton}>
                        <Text style={profilestyle.toggleText}>{showPassword ? "Hide" : "Show"}</Text>
                    </TouchableOpacity>
                </View>

                <View style={profilestyle.infoRow}><Text>Contact no: 0912341266</Text></View>
                <View style={profilestyle.infoRow}><Text>Status: Active</Text></View>
            </View>
            <View style={profilestyle.buttonContainer}>
                <TouchableOpacity onPress={() => nav.navigate("Message")} style={profilestyle.messageButton}>
                    <Text style={profilestyle.buttonText2}>Message Admin</Text>
                </TouchableOpacity>
            </View>
            {/* Buttons */}
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
                <TouchableOpacity onPress={handleLogout} style={profilestyle.logoutButton}>
                    <Text style={profilestyle.buttonText}>Log Out</Text>
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