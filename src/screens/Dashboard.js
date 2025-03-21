import React, { useState } from "react";
import {
   View,
    Text,
    TextInput,
    Image,
    Switch,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { dashboardstyles } from "../styles/dashboardcss";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import profileicon from "../assets/profile.png";

function Dashboard({ navigation }) {
    const nav = useNavigation();
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [sensorEnabled, setSensorEnabled] = useState(false);

    const handleLocationToggle = (value) => {
      setLocationEnabled(value);
      if (value) {
          Alert.alert(
              "Enable Location?",
              "Do you want to allow location updates?",
              [
                  { text: "Cancel", style: "cancel", onPress: () => setLocationEnabled(false) },
                  { text: "Allow", onPress: () => setLocationEnabled(true) }
              ]
          );
      }
  };

    const handleLogout = () => {
        nav.navigate("Login");
    };

    return (
        <View style={{ flex: 1 }}> 
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}> 
                <Image
                    source={require("../assets/map.png")}
                    style={dashboardstyles.mapImage}
                    resizeMode="cover"
                />             
                <View style={dashboardstyles.card}>
                    <Text style={dashboardstyles.label}>Your Location</Text>
                    <TextInput
                        style={dashboardstyles.input}
                        value={"2972 Westheimer Rd. Santa Ana, Illinois 85486"}
                        editable={false}
                    />

                    <Text style={dashboardstyles.label}>Destination</Text>
                    <TextInput
                        style={dashboardstyles.input}
                        value={"2972 West Philippine Sea Rd. Santa Ana, Illinois 85486"}
                        editable={false}
                    />

                    <View style={loginstyle.toggleRow}>
                       <Text style={loginstyle.locationText}>Location Update: {locationEnabled ? "On" : "Off"}</Text>
                        <Switch value={locationEnabled} onValueChange={handleLocationToggle} />
                    </View>

                    <View style={loginstyle.toggleRow}>
                        <Text style={loginstyle.locationText}>Sensor: {sensorEnabled ? "GPS Sensor" : "Cell Tower + WiFi"}</Text>
                        <Switch value={sensorEnabled} onValueChange={(value) => setSensorEnabled(value)} />
                    </View>

                    <View style={{ marginVertical: 5 }} />


                    {locationEnabled && (
                        <>
                            <Text style={dashboardstyles.coordinates}>Longitude: 39202.2324</Text>
                            <Text style={dashboardstyles.coordinates}>Latitude: 122.00</Text>
                        </>
                    )}
                </View>
            </ScrollView>

            <View style={navbar.bottomNav2}>
                <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
                    <Image source={homeIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Trips")}>
                    <Image source={userIcon} style={navbar.navIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate("Profile")}>
                    <Image source={profileicon} style={navbar.navIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Dashboard;
