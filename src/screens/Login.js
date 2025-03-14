import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { loginstyle } from "../styles/Styles";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPressed, setIsPressed] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "All fields are required!", [{ text: "OK" }]);
      return;
    }

    if (username === "driver1" && password === "mansar") {
      Alert.alert("Success", "Login Successful!", [{ text: "OK" }]);
      navigation.navigate("Dashboard", { username });
    } else {
      Alert.alert("Error", "Invalid username or password!", [{ text: "OK" }]);
    }
  };

  return (
    <View style={[loginstyle.container, { backgroundColor: "#FFFAF3" }]}>
      <View style={loginstyle.innerContainer}>
        <Text style={loginstyle.title}>Login</Text>

        <Text>Username</Text>
        <TextInput
          value={username}
          style={loginstyle.textinput}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />

        <Text>Password</Text>
        <TextInput
          value={password}
          style={loginstyle.textinput}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Enter your password"
        />

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

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: "#841584", fontWeight: "bold" }}>
              Register as User
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;