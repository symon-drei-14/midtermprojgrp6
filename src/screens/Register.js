import React, { useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { loginstyle } from "../styles/Styles";

const Register = ({ navigation }) => {
  const [surname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [password, setPass] = useState("");
  const [conpass, setConPass] = useState("");
  const [email, setEmail] = useState("");


  const handleInputChange = (field, value) => {
    switch (field) {
      case "firstname":
        setFirstname(value);
        break;
      case "surname":
        setLastname(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPass(value);
        break;
      case "conpass":
        setConPass(value);
        break;
      default:
        break;
    }
  };

  const handlePress = () => {
    if (!firstname || !surname || !email || !password || !conpass) {
      Alert.alert("Error", "All fields are required!", [{ text: "OK" }]);
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long!", [{ text: "OK" }]);
      return;
    }

    if (password !== conpass) {
      Alert.alert("Error", "Passwords do not match!", [{ text: "OK" }]);
      return;
    }

    Alert.alert("Success", "Registration Successful!", [{ text: "OK" }]);
    console.log("Registration successful");

   
    navigation.navigate("Dashboard", { firstname });
  };

  return (
    <View style={loginstyle.container}>
      <View style={loginstyle.innerContainer}>
        <Text style={loginstyle.title}>Create your own account</Text>

        <Text>First Name</Text>
        <TextInput
          value={firstname}
          style={loginstyle.textinput}
          onChangeText={(value) => handleInputChange("firstname", value)}
          placeholder="Enter your first name"
          placeholderTextColor="#999"
        />

        <Text>Surname</Text>
        <TextInput
          value={surname}
          style={loginstyle.textinput}
          onChangeText={(value) => handleInputChange("surname", value)}
          placeholder="Enter your surname"
          placeholderTextColor="#999"
        />

        <Text>Email</Text>
        <TextInput
          value={email}
          style={loginstyle.textinput}
          onChangeText={(value) => handleInputChange("email", value)}
          placeholder="example@example.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />

        <Text>Password</Text>
        <TextInput
          value={password}
          style={loginstyle.textinput}
          onChangeText={(value) => handleInputChange("password", value)}
          secureTextEntry={true}
          placeholder="Enter your password"
          placeholderTextColor="#999"
        />

        <Text>Confirm Password</Text>
        <TextInput
          value={conpass}
          style={[loginstyle.textinput, { marginBottom: 35 }]}
          onChangeText={(value) => handleInputChange("conpass", value)}
          secureTextEntry={true}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={loginstyle.button}
          onPress={handlePress}
        >
          <Text style={loginstyle.buttonText}>Sign Up</Text>
        </TouchableOpacity>

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