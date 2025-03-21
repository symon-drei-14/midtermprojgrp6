import React, { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, Image, ImageBackground } from "react-native";
import { loginstyle } from "../styles/Styles";
import loginbackground from "../assets/loginbg.png";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
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
      <View style={[loginstyle.container, { backgroundColor: "#FFFAF3" }]}>
        <Image
          source={require("../assets/bgpic.png")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
      </View>
    );
  }

  const validateUsername = (text) => {
    setUsername(text);
    if (text.length === 0) {
      setUsernameError("Username is required.");
    } else if (text.length < 4) {
      setUsernameError("Username must be at least 4 characters");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text.length === 0) {
      setPasswordError("Password is required.");
    } else if (text.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = () => {
    let valid = true;

    if (username.length === 0) {
        setUsernameError("Username is required.");
        valid = false;
    } else if (username.length < 4) {
        setUsernameError("Username must be at least 4 characters.");
        valid = false;
    } else if (username !== "driver") {
        setUsernameError("Invalid username.");
        valid = false;
    } else {
        setUsernameError("");
    }

    if (password.length === 0) {
        setPasswordError("Password is required.");
        valid = false;
    } else if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters.");
        valid = false;
    } else if (password !== "mansarftw") {
        setPasswordError("Invalid password.");
        valid = false;
    } else {
        setPasswordError("");
    }

    if (!valid) return;

    alert("Login Successful!");
    navigation.navigate("Dashboard", { username });
  };

  return (
    <ImageBackground source={loginbackground} style={loginstyle.background}>
      <View style={[loginstyle.container, { backgroundColor: "#" }]}>
        <View style={loginstyle.innerContainer}>
          <Text style={loginstyle.title}>Login</Text>

          <Text>Username</Text>
          <TextInput
            value={username}
            style={[
              loginstyle.textinput,
              usernameError ? loginstyle.inputError : null,
            ]}
            onChangeText={validateUsername}
            placeholder="Enter your username"
          />
          {usernameError ? <Text style={loginstyle.errorText}>{usernameError}</Text> : null}

          <Text>Password</Text>
          <TextInput
            value={password}
            style={[
              loginstyle.textinput,
              passwordError ? loginstyle.inputError : null,
            ]}
            onChangeText={validatePassword}
            secureTextEntry={true}
            placeholder="Enter your password"
          />
          {passwordError ? <Text style={loginstyle.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity
            style={[
              loginstyle.button,
              { backgroundColor: isPressed ? "#6A0DAD" : "#478843" },
            ]}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleLogin}
          >
            <Text style={loginstyle.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;
