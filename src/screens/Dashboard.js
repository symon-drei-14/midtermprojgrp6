import { View, Image, TouchableOpacity, Text, Switch, Button, Alert } from "react-native";
import { useNavigation,useRoute } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import React, { useState } from "react";
import { navbar } from "../styles/Navbar";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import locationIcon from "../assets/exp2.png";
import profileicon from "../assets/profile.png"

function Dashboard({ navigation }) {
  const nav = useNavigation();
  // const route = useRoute();
  // const { username } = route.params; 
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [sensorEnabled, setSensorEnabled] = useState(false);

  const handleLocationToggle = (value) => {
    if (value) {
      Alert.alert(
        "Enable Location?",
        "Do you want to allow location updates?",
        [
          { text: "Cancel", style: "cancel", onPress: () => setLocationEnabled(false) },
          { text: "Allow", onPress: () => setLocationEnabled(true) }
        ]
      );
    } else {
      setLocationEnabled(false);
    }
  };

  const handleLogout = () => {
    nav.navigate("Login"); 
  };

  const handleprofile = () => {
    nav.navigate("Profile"); 
  };
  return (
    <View style={loginstyle.container2}>
      <View style={loginstyle.greetingContainer}>
        <Text style={loginstyle.greetingText}>Hello,</Text>
        <Text style={loginstyle.greetingText}>Drivers</Text> 
      </View>

      <View style={loginstyle.itemContainer}>
        <View style={loginstyle.ContainerItem}>
          <Text style={loginstyle.itemLabel}>Ongoing Trips</Text>
          <Text style={loginstyle.itemValue}>2</Text>
        </View>
        <View style={loginstyle.ContainerItem}>
          <Text style={loginstyle.itemLabel}>Completed Trips</Text>
          <Text style={loginstyle.itemValue}>0</Text>
        </View>
      </View>

      <View style={loginstyle.locationCard}>
        <View style={{ marginVertical: 30 }} />
        <Text style={loginstyle.locationTitle}>GPS Settings</Text>

    <View style={loginstyle.toggleRow}>
      <Text style={loginstyle.locationText}>Location Update: {locationEnabled ? "On" : "Off"}</Text>
      <Switch value={locationEnabled} onValueChange={handleLocationToggle} />
    </View>

    <View style={loginstyle.toggleRow}>
      <Text style={loginstyle.locationText}>Sensor: {sensorEnabled ? "GPS Sensor" : "Cell Tower + WiFi"}</Text>
        <Switch
          value={sensorEnabled}
          onValueChange={(value) => setSensorEnabled(value)}
        />
    </View>

        <View style={{ marginVertical: 20 }} />
      
        <TouchableOpacity onPress={handleLogout} style={loginstyle.logoutButton}>
          <Text style={loginstyle.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 80 }} />
      </View>
      

      <View style={navbar.bottomNav}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
          <Image source={homeIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Trips")}>
          <Image source={userIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Expenses")}>
          <Image source={locationIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Profile")}>
          <Image source={profileicon} style={navbar.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Dashboard;