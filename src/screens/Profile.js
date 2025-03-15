import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
// import { Avatar } from '@rneui/themed';
import { profilestyle } from "./styles/profilestyle"; 
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";

const Profile = ({ navigation }) => {
  return (
    <View style={loginstyle.profilestyle.container}>
      <View style={loginstyle.profilestyle.profileCard}>
        
        <View style={loginstyle.profilestyle.avatarContainer}>
          {/* <Avatar
            size={100}
            rounded
            icon={{ name: 'person', type: 'material' }}
            containerStyle={[{ backgroundColor: 'orange' }, loginstyle.profilestyle.avatar]}
          /> */}
          <Text style={loginstyle.profilestyle.name}>My Love</Text>
          <Text style={loginstyle.profilestyle.role}>Professional Gaslighter</Text>
        </View>

        <View style={loginstyle.profilestyle.detailsContainer}>
          <Text style={loginstyle.profilestyle.detailTitle}>Driver Information</Text>
          <Text style={loginstyle.profilestyle.driverInfo}>📞 Phone: (63) 09123456789</Text>
          <Text style={loginstyle.profilestyle.driverInfo}>🏠 Address: 123 Banda roon st. Malapit lang</Text>
          <Text style={loginstyle.profilestyle.driverInfo}>🚗 Vehicle: Lightning Mcqueen 2022</Text>
          <Text style={loginstyle.profilestyle.driverInfo}>🪪 License: ABC123456 </Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;