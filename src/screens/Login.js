import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator } from "react-native";
import { loginstyle } from "../styles/Styles";
import loginbackground from "../assets/loginbg.png";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation, onLoginSuccess, setUserSession }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);

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
      const response = await fetch('http://192.168.1.4/capstone-1-eb/include/handlers/login_handler.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const rawResponse = await response.text();
      console.log("Raw API response:", rawResponse);
      
      let result;
      try {
        result = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error(`Invalid JSON response: ${rawResponse.substring(0, 100)}...`);
      }
      
      if (result.success) {
        const userData = {
          userId: result.user.driver_id,
          email: result.user.email,
          driverName: result.user.name || email.split('@')[0],
          tripId: `trip_${Date.now()}`,
          truckId: `truck_${Date.now()}`
        };
        
        await storeUserSession(userData);
        
        setLoading(false);
        
        onLoginSuccess(true);
        
        Alert.alert(
          "Login Successful",
          "Welcome back!",
          [
            {
              text: "Continue",
              onPress: () => {
                console.log("Login successful, navigation handled by App.js");
              }
            }
          ]
        );
      } else {
        setLoading(false);
        
        if (result.error === "invalid_email") {
          setEmailError("Account not found. Please check your email or register.");
        } else if (result.error === "invalid_password") {
          setPasswordError("Incorrect password. Please try again.");
        } else {
          Alert.alert("Login Error", result.message || "Authentication failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      
      Alert.alert(
        "Connection Error", 
        "Unable to connect to the server. Please check your internet connection and try again."
      );
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
            editable={!loading}
          />
          {emailError ? <Text style={loginstyle.errorText}>{emailError}</Text> : null}

          <Text style={loginstyle.label}>Password</Text>
          <TextInput
            value={password}
            style={[loginstyle.textinput, passwordError ? loginstyle.inputError : null]}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            placeholder="Enter your password"
            editable={!loading}
          />
          {passwordError ? <Text style={loginstyle.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity
            style={[
              loginstyle.button, 
              { backgroundColor: isPressed ? "#6A0DAD" : "#478843" },
              loading && { opacity: 0.7 }
            ]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={loginstyle.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")} disabled={loading}>
            <Text style={{ color: "#478843", marginTop: 10, textAlign: "center" }}>
              Don't have an account? Register here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;