import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { loginstyle } from "../styles/Styles";
import firestore from "@react-native-firebase/firestore";
import loginbackground from "../assets/loginbg.png";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [assignedTruckId, setAssignedTruckId] = useState("");
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    let newErrors = {};

    if (!name) newErrors.name = "Full name is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!assignedTruckId) newErrors.assignedTruckId = "Assigned truck ID is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const emailExists = await firestore().collection("Drivers_table").where("email", "==", email).get();
      if (!emailExists.empty) {
        setErrors({ email: "Email is already in use." });
        return;
      }

      const newDriverRef = firestore().collection("Drivers_table").doc();
      await newDriverRef.set({
        driver_id: newDriverRef.id, // Auto-generated ID
        name,
        email,
        password, // Storing plain text for now (consider hashing)
        assigned_truck_id: parseInt(assignedTruckId),
      });

      alert("Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ImageBackground source={loginbackground} style={loginstyle.background}>
      <View style={loginstyle.container}>
        <View style={loginstyle.innerContainer}>

          <Text>Full Name</Text>
          <TextInput
            value={name}
            style={[loginstyle.textinput, errors.name ? loginstyle.inputError : null]}
            onChangeText={setName}
            placeholder="Enter full name"
          />
          {errors.name && <Text style={loginstyle.errorText}>{errors.name}</Text>}

          <Text>Email</Text>
          <TextInput
            value={email}
            style={[loginstyle.textinput, errors.email ? loginstyle.inputError : null]}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />
          {errors.email && <Text style={loginstyle.errorText}>{errors.email}</Text>}

          <Text>Password</Text>
          <TextInput
            value={password}
            style={[loginstyle.textinput, errors.password ? loginstyle.inputError : null]}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Enter password"
          />
          {errors.password && <Text style={loginstyle.errorText}>{errors.password}</Text>}

          <Text>Confirm Password</Text>
          <TextInput
            value={confirmPassword}
            style={[loginstyle.textinput, errors.confirmPassword ? loginstyle.inputError : null]}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && <Text style={loginstyle.errorText}>{errors.confirmPassword}</Text>}

          <Text>Assigned Truck ID</Text>
          <TextInput
            value={assignedTruckId}
            style={[loginstyle.textinput, errors.assignedTruckId ? loginstyle.inputError : null]}
            onChangeText={setAssignedTruckId}
            placeholder="Enter assigned truck ID"
            keyboardType="numeric"
          />
          {errors.assignedTruckId && <Text style={loginstyle.errorText}>{errors.assignedTruckId}</Text>}

          <TouchableOpacity style={loginstyle.button} onPress={handleRegister}>
            <Text style={loginstyle.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#478843", textAlign: "center", marginTop: 10 }}>
              Already have an account? Login here.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Register;
