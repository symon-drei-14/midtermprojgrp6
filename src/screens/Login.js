import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import { loginstyle } from "../styles/Styles";
import firestore from "@react-native-firebase/firestore";
import loginbackground from "../assets/loginbg.png";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 2000);
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
    
    // Reset previous errors
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

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const userQuery = await firestore()
        .collection("Drivers_table")
        .where("email", "==", email)
        .get();

      if (userQuery.empty) {
        setEmailError("Account not found. Please check your email or register.");
        return;
      }

      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;
      
      if (userData.password !== password) {
        setPasswordError("Incorrect password. Please try again.");
        return;
      }

      // Create a new trip ID for this session
      const tripId = `trip_${Date.now()}`;
      
      Alert.alert(
        "Login Successful",
        "Welcome back!",
        [
          {
            text: "Continue",
            onPress: () => navigation.navigate("Dashboard", { 
              userId: userId, 
              email: email,
              tripId: tripId,
              driverName: userData.name || email.split('@')[0]
            })
          }
        ]
      );
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Error", "Something went wrong. Please try again.");
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
          />
          {emailError ? <Text style={loginstyle.errorText}>{emailError}</Text> : null}

          <Text style={loginstyle.label}>Password</Text>
          <TextInput
            value={password}
            style={[loginstyle.textinput, passwordError ? loginstyle.inputError : null]}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            placeholder="Enter your password"
          />
          {passwordError ? <Text style={loginstyle.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity
            style={[loginstyle.button, { backgroundColor: isPressed ? "#6A0DAD" : "#478843" }]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleLogin}
          >
            <Text style={loginstyle.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
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