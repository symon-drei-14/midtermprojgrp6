import React, { useState } from "react";
import { Text, View, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { loginstyle } from "../styles/Styles"; // Adjusted path assuming it's inside 'screens' directory

const Register = ({navigation}) => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [password, setPass] = useState("");
  const [conpass, setConPass] = useState("");
  const [email, setEmail] = useState("");

  const handlePress = () => {
    if (!username || !firstname || !email || !password || !conpass) {
      Alert.alert("Error", "All fields are required!", [{ text: "OK" }]);
      return;
    }

    if (password !== conpass) {
      Alert.alert("Error", "Passwords do not match!", [{ text: "OK" }]);
      return;
    }

    Alert.alert("Success", "Registration Successful!", [{ text: "OK" }]);
    console.log("Registration successful");
  };

  return (
    <View style={loginstyle.container}>
      <View style={loginstyle.innerContainer}>
        <Text style={loginstyle.title}>Create your own account</Text>

        <Text>First name</Text>
        <TextInput
          value={username}
          style={loginstyle.textinput}
          onChangeText={setUsername}
          placeholder="Enter your first name"
          placeholderTextColor="#999"
        />

        <Text>Surname</Text>
        <TextInput
          value={firstname}
          style={loginstyle.textinput}
          onChangeText={setFirstname}
          placeholder="Enter your surname"
          placeholderTextColor="#999"
        />

        <Text>Email</Text>
        <TextInput
          value={email}
          style={loginstyle.textinput}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        <Text>Password</Text>
        <TextInput
          value={password}
          style={loginstyle.textinput}
          onChangeText={setPass}
          secureTextEntry={true}
          placeholder="Enter your password"
          placeholderTextColor="#999"
        />

        <Text>Confirm Password</Text>
        <TextInput
          value={conpass}
          style={[loginstyle.textinput, { marginBottom: 35 }]}
          onChangeText={setConPass}
          secureTextEntry={true}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
        />

        <Button onPress={handlePress} title="Sign in" color="#841584" />
            <View style={{ marginTop: 20, alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 10 }}> 
            <Text style={{ color: "#841584", fontWeight: "bold" }}>Already registered? Sign in</Text>
          </TouchableOpacity>
        
        </View>
      </View>
    </View>
  );
};

export default Register;