import React, { useState,useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity,Image } from "react-native";
import { loginstyle } from "../styles/Styles";

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
    }, 3000);
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
    if (text.length < 5) {
    
      setUsernameError("Username must be atleast 4 characters");
    }
      else if (text.length < 1) {
        setUsernameError("Username is required.");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text.length < 8) {
      setPasswordError("Password must be atleast 8 characters");
}
else if (text.length < 1) {
  setPasswordError("Password is required.");
}

else {
      setPasswordError("");
    }
  };

  const handleLogin = () => {
    let valid = true;

    if (username.length < 4) {
      setUsernameError("Username is required.");
      valid = false;
    }

    if (password.length < 4) {
      setPasswordError("Password is required.");
      valid = false;
    }

    if (!valid) return;

    
    alert("Login Successful!");
    navigation.navigate("Dashboard", { username });
  };

  return (
    <View style={[loginstyle.container, { backgroundColor: "#FFFAF3" }]}>
      <View style={loginstyle.innerContainer}>
        <Text style={loginstyle.title}>Login</Text>

        <Text>Username</Text>
        <TextInput
          value={username}
          style={[
            loginstyle.textinput,
            usernameError ? loginstyle.inputError :null
          ]}
          onChangeText={validateUsername}
          placeholder="Enter your username"
        />
        {usernameError ? <Text style={ loginstyle.errorText}>{usernameError}</Text> : null}

        <Text>Password</Text>
        <TextInput
          value={password}
          style={[
            loginstyle.textinput,
            passwordError ? loginstyle.inputError :null
          ]}
          onChangeText={validatePassword}
          secureTextEntry={true}
          placeholder="Enter your password"
        />
        {passwordError ? <Text style={ loginstyle.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity
          style={[
            loginstyle.button,
            { backgroundColor: isPressed ? "#6A0DAD" : "#841584" },
          ]}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={handleLogin}
        >
          <Text style={loginstyle.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;