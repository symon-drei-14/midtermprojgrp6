import { View, Image, TouchableOpacity, Text, Switch, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import React, { useState } from "react";

import homeIcon from "../assets/home.jpg";
import userIcon from "../assets/exp.jpg";
import locationIcon from "../assets/trip.jpg";

function Dashboard({ navigation }) {
  const nav = useNavigation();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [sensorEnabled, setSensorEnabled] = useState(false);

  const handleLogout = () => {
    nav.navigate("LandingPage"); 
  };

  return (
    <View style={loginstyle.container2}>
      <View style={loginstyle.greetingContainer}>
        <Text style={loginstyle.greetingText}>Hello,</Text>
        <Text style={loginstyle.greetingText}>User</Text>
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
        <Text style={loginstyle.locationTitle}>Location Info</Text>
        <Text style={loginstyle.locationText}>Latitude: ?????</Text>
        <Text style={loginstyle.locationText}>Longitude: ?????</Text>

        <View style={loginstyle.toggleRow}>
          <Text style={loginstyle.locationText}>Location Update</Text>
          <Switch
            value={locationEnabled}
            onValueChange={(value) => setLocationEnabled(value)}
          />
        </View>

        <View style={loginstyle.toggleRow}>
          <Text style={loginstyle.locationText}>Sensor</Text>
          <Switch
            value={sensorEnabled}
            onValueChange={(value) => setSensorEnabled(value)}
          />
        </View>

        
        <View style={{ marginVertical: 20 }} />
        <TouchableOpacity onPress={handleLogout} style={loginstyle.logoutButton}>
          <Text style={loginstyle.logoutText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={loginstyle.logoutButton}>
          <Text style={loginstyle.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ marginVertical: 80 }} />
      </View>
      

      <View style={loginstyle.bottomNav}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
          <Image source={homeIcon} style={loginstyle.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Trips")}>
          <Image source={userIcon} style={loginstyle.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Expenses")}>
          <Image source={locationIcon} style={loginstyle.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Dashboard;