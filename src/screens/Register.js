import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { loginstyle } from "../styles/Styles";
import database from "@react-native-firebase/database";
import loginbackground from "../assets/loginbg.png";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [assignedTruckId, setAssignedTruckId] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    let newErrors = {};

    if (!name) newErrors.name = "Full name is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!assignedTruckId) newErrors.assignedTruckId = "Truck ID is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      const driver_id = Date.now().toString();
      
      const driverData = {
        driver_id,
        name,
        email,
        password,
        assigned_truck_id: parseInt(assignedTruckId),
        created_at: new Date().toISOString(),
        last_login: null
      };

      await database()
        .ref(`/drivers/${driver_id}`)
        .set({
          ...driverData,
          location: {
            latitude: 0,
            longitude: 0,
            last_updated: null
          }
        });

      try {
        const apiPayload = {
          driver_id,
          firebase_uid: driver_id,
          name,
          email,
          password, 
          assigned_truck_id: parseInt(assignedTruckId),
        };
        
        console.log("Sending to PHP API:", apiPayload);
        
        const response = await fetch('http://192.168.1.3/Capstone-1-eb/include/handlers/drivers.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(apiPayload),
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
        
        if (!result.success) {
          throw new Error(result.message || "Error saving to MySQL database");
        }
        
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("Login");
        
      } catch (apiError) {
        console.error("API Error:", apiError);
        
        Alert.alert(
          "Registration Error",
          "There was an issue with the database connection. Please try again later.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <ImageBackground source={loginbackground} style={loginstyle.background}>
      <View style={loginstyle.container3}>
        <View style={loginstyle.innerContainer2}>
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
            placeholder="Enter truck ID"
            keyboardType="numeric"
          />
          {errors.assignedTruckId && <Text style={loginstyle.errorText}>{errors.assignedTruckId}</Text>}

          <TouchableOpacity 
            style={[loginstyle.button, loading && loginstyle.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={loginstyle.buttonText}>{loading ? "Processing..." : "Register"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} disabled={loading}>
            <Text style={{ color: "#478843", textAlign: "center", marginTop: 10 }}>
              Already have an account? Login here.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    // </ImageBackground>
  );
};

export default Register;