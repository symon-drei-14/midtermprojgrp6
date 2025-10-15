import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator, Modal, Keyboard } from "react-native";
import { loginstyle } from "../styles/Styles";
import loginbackground from "../assets/loginbg.png";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

const Login = ({ navigation, onLoginSuccess, setUserSession }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // States for OTP flow
  const [otp, setOtp] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFAF3" }}>
        <Image source={require("../assets/bgpic.png")} style={loginstyle.splashImage} />
      </View>
    );
  }



  const validateInputs = () => {
    let isValid = true;
    
    setEmailError("");
    setPasswordError("");
    
    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    }
    
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }
    
    return isValid;
  };

  const storeUserSession = async (userData) => {
    try {
      const sessionData = {
        ...userData,
        loginTimestamp: Date.now()
      };
      
      await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));
      setUserSession(sessionData);
    } catch (error) {
      console.error("Error storing session:", error);
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/include/handlers/login_handler.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.otp_required) {
            // OTP is needed, so we show the modal.
            setLoading(false);
            setOtpModalVisible(true);
            Alert.alert("Verification Required", result.message);
        } else {
            // This case would be for logins that don't need OTP, which isn't our current flow
            // but is good to have.
            console.warn("Login succeeded without OTP, which is not the expected flow.");
        }
      } else {
        setLoading(false);
        // --- START OF ADDITION: Handle Lockout/Attempt Errors ---
        if (result.error === "login_locked") {
             // Handle locked account message provided by the server
             Alert.alert("Account Locked", result.message);
        } else if (result.error === "invalid_email") {
          setEmailError("Account not found. Please check your email.");
        } else if (result.error === "invalid_password") {
          // Display the specific remaining attempt message from the server
          setPasswordError(result.message || "Incorrect password. Please try again.");
        } else {
          Alert.alert("Login Error", result.message || "Authentication failed.");
        }
        // --- END OF ADDITION ---
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      Alert.alert("Connection Error", "Unable to connect to the server. Please check your internet connection.");
    }
  };

  const handleVerifyOtp = async () => {
    Keyboard.dismiss();
    if (!otp.trim() || otp.length !== 6) {
        Alert.alert("Invalid OTP", "Please enter the 6-digit code sent to your email.");
        return;
    }

    setIsVerifyingOtp(true);
    try {
        const response = await fetch(`${API_BASE_URL}/include/handlers/login_handler.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email: email, otp: otp }),
        });

        const result = await response.json();

        if (result.success) {
            // Include the Firebase UID and Truck ID from the PHP response
            const userData = {
                userId: result.user.driver_id, // SQL Driver ID for PHP calls
                firebaseUserId: result.user.firebase_uid, // The correct Firebase UID for RTDB
                email: result.user.email,
                driverName: result.user.name || email.split('@')[0],
                assignedTruckId: result.user.assigned_truck_id,
            };
            
            await storeUserSession(userData);
            
            setIsVerifyingOtp(false);
            setOtpModalVisible(false);
            onLoginSuccess(true);
            
            Alert.alert("Login Successful", "Welcome back!", [{
                text: "Continue",
                onPress: () => console.log("OTP login successful.")
            }]);
        } else {
            setIsVerifyingOtp(false);
             // --- START OF ADDITION: Handle OTP Blocked Error ---
            if (result.error === "otp_blocked") {
                 // Close the OTP modal and show the block message
                 setOtpModalVisible(false);
                 Alert.alert("OTP Blocked", result.message);
            } else {
                 Alert.alert("Verification Failed", result.message || "An unknown error occurred.");
            }
             // --- END OF ADDITION ---
        }
    } catch (error) {
        console.error("OTP Verification Error:", error);
        setIsVerifyingOtp(false);
        Alert.alert("Connection Error", "Could not verify OTP. Please check your connection and try again.");
    }
  };


  return (
    <ImageBackground source={loginbackground} style={loginstyle.background}>
      <View style={[loginstyle.container]}>
        <View style={loginstyle.innerContainer}>
          <Text style={loginstyle.title}>Login</Text>

          <Text style={loginstyle.label}>Email</Text>
          <TextInput
            value={email}
            style={[loginstyle.textinput, emailError ? loginstyle.inputError : null]}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading && !isVerifyingOtp}
          />
          {emailError ? <Text style={loginstyle.errorText}>{emailError}</Text> : null}

          <Text style={loginstyle.label}>Password</Text>
          <TextInput
            value={password}
            style={[loginstyle.textinput, passwordError ? loginstyle.inputError : null]}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            placeholder="Enter your password"
            editable={!loading && !isVerifyingOtp}
          />
          {passwordError ? <Text style={loginstyle.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity
            style={[ loginstyle.button, { backgroundColor: isPressed ? "#6A0DAD" : "#478843" }, (loading || isVerifyingOtp) && { opacity: 0.7 }]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleLogin}
            disabled={loading || isVerifyingOtp}
          >
            {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={loginstyle.buttonText}>Login</Text>}
          </TouchableOpacity>
        </View>
      </View>
      
      {/* --- OTP MODAL --- */}
      <Modal visible={otpModalVisible} transparent animationType="slide">
        <View style={loginstyle.container}>
            <View style={loginstyle.innerContainer}>
                <Text style={loginstyle.title}>Enter Verification Code</Text>
                <Text style={{textAlign: 'center', marginBottom: 20, color: '#555'}}>A 6-digit code was sent to your email address.</Text>

                <TextInput
                    style={loginstyle.textinput}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    editable={!isVerifyingOtp}
                />

                <TouchableOpacity
                    onPress={handleVerifyOtp}
                    style={[loginstyle.button, { backgroundColor: '#478843' }, isVerifyingOtp && { opacity: 0.6 }]}
                    disabled={isVerifyingOtp}
                >
                    {isVerifyingOtp ? <ActivityIndicator color="#fff" /> : <Text style={loginstyle.buttonText}>Verify & Login</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setOtpModalVisible(false); setOtp(""); }}
                    style={[loginstyle.button, { backgroundColor: '#888', marginTop: 10 }]}
                    disabled={isVerifyingOtp}
                >
                    <Text style={loginstyle.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </ImageBackground>
  );
};

export default Login;