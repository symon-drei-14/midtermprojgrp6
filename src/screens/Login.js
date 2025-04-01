import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground } from "react-native";
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

  const handleLogin = async () => {
    if (!email || !password) {
      setEmailError(email ? "" : "Email is required.");
      setPasswordError(password ? "" : "Password is required.");
      return;
    }

    try {
      const userQuery = await firestore()
        .collection("Drivers_table")
        .where("email", "==", email)
        .get();

      if (userQuery.empty) {
        setEmailError("Invalid email.");
        return;
      }

      const userData = userQuery.docs[0].data();
      if (userData.password !== password) {
        setPasswordError("Invalid password.");
        return;
      }

      alert("Login Successful!");
      navigation.navigate("Dashboard", { email });
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ImageBackground source={loginbackground} style={loginstyle.background}>
      <View style={[loginstyle.container, { backgroundColor: "#" }]}>
        <View style={loginstyle.innerContainer}>
          <Text style={loginstyle.title}>Login</Text>

          <Text>Email</Text>
          <TextInput
            value={email}
            style={[loginstyle.textinput, emailError ? loginstyle.inputError : null]}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
          />
          {emailError ? <Text style={loginstyle.errorText}>{emailError}</Text> : null}

          <Text>Password</Text>
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

          {/* Register Link */}
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
