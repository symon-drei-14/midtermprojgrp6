import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { profilestyle } from "../styles/Profilecss";
import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import locationIcon from "../assets/exp2.png";
import profileicon from "../assets/profile.png";

const Profile = () => {
    const nav = useNavigation();
    const [password, setPassword] = useState(""); 
    const [savedPassword, setSavedPassword] = useState("********"); // Default hidden password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    const validatePassword = (text) => {
        setPassword(text);
        if (text.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
        } else {
            setPasswordError("");
        }
    };

    const handleSave = () => {
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }
        setSavedPassword(password); // Save the new password
        setIsEditing(false);
        alert("Password updated successfully!");
    };

    return (
        <View style={profilestyle.container}>
            <View style={profilestyle.profileCard}>
                <View style={profilestyle.avatarContainer}>
                    <Text style={profilestyle.name}>My Love</Text>
                    <Text style={profilestyle.role}>Professional Gaslighter</Text>
                </View>

                <View style={profilestyle.detailsContainer}>
                    <Text style={profilestyle.detailTitle}>Driver Information</Text>

                    {/* Password Input Field */}
                    <View style={profilestyle.inputContainer}>
                        <Text>🔒 Password:</Text>

                        <View style={{ flex: 1 }}>
                            {isEditing ? (
                                <TextInput
                                    value={password}
                                    style={[
                                        loginstyle.textinput,
                                        passwordError ? loginstyle.inputError : null,
                                    ]}
                                    onChangeText={validatePassword}
                                    secureTextEntry={!isPasswordVisible}
                                    placeholder="Enter new password"
                                />
                            ) : (
                                <Text style={profilestyle.driverInfo}>
                                    {isPasswordVisible ? savedPassword : "********"}
                                </Text>
                            )}

                            {passwordError ? (
                                <Text style={loginstyle.errorText}>{passwordError}</Text>
                            ) : null}
                        </View>

                        {/* Toggle Visibility Button */}
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Text style={profilestyle.toggleText}>
                                {isPasswordVisible ? "Hide" : "Show"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Edit/Save Button */}
                    <TouchableOpacity
                        style={profilestyle.editButton}
                        onPress={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        <Text style={profilestyle.editButtonText}>
                            {isEditing ? "Save" : "Edit"}
                        </Text>
                    </TouchableOpacity>

                    <Text style={profilestyle.driverInfo}>📞 Phone: (63) 09123456789</Text>
                    <Text style={profilestyle.driverInfo}>🏠 Address: 123 Banda roon st. Malapit lang</Text>
                    <Text style={profilestyle.driverInfo}>🚗 Vehicle: Lightning McQueen 2022</Text>
                    <Text style={profilestyle.driverInfo}>🪪 License: ABC123456</Text>
                </View>
            </View>

            {/* Bottom Navigation */}
            <View style={navbar.bottomNav}>
                <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
                    <Image source={homeIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Trips")}>
                    <Image source={userIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Expenses")}>
                    <Image source={locationIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Profile")}>
                    <Image source={profileicon} style={navbar.navIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Profile;