import React from 'react';
import { View, Text, TouchableOpacity,Image } from 'react-native';
// import { Avatar } from '@rneui/themed';

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { profilestyle } from "../styles/Profilecss";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import locationIcon from "../assets/exp2.png";
import profileicon from "../assets/profile.png"

const Profile = ({ navigation }) => {
    const nav = useNavigation();
  return (
    <View style={profilestyle.container}>
      <View style={profilestyle.profileCard}>
        
        <View style={profilestyle.avatarContainer}>
          {/* <Avatar
            size={100}
            rounded
            icon={{ name: 'person', type: 'material' }}
            containerStyle={[{ backgroundColor: 'orange' }, loginstyle.profilestyle.avatar]}
          /> */}
          <Text style={profilestyle.name}>My Love</Text>
          <Text style={profilestyle.role}>Professional Gaslighter</Text>
        </View>

        <View style={profilestyle.detailsContainer}>
          <Text style={profilestyle.detailTitle}>Driver Information</Text>
          <Text style={profilestyle.driverInfo}>📞 Phone: (63) 09123456789</Text>
          <Text style={profilestyle.driverInfo}>🏠 Address: 123 Banda roon st. Malapit lang</Text>
          <Text style={profilestyle.driverInfo}>🚗 Vehicle: Lightning Mcqueen 2022</Text>
          <Text style={profilestyle.driverInfo}>🪪 License: ABC123456 </Text>
        </View>
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
};

export default Profile;