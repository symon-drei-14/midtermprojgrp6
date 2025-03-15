import React, { useState, useCallback, } from 'react';
import { View, Text, TouchableOpacity, Modal,Image } from 'react-native';
import { useFocusEffect,useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { tripstyle } from "../styles/Tripcss";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import locationIcon from "../assets/exp2.png";
import profileicon from "../assets/profile.png"

const Trips = ({ navigation }) => {
   const nav = useNavigation();
  const [status, setStatus] = useState('On-Going');
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
    }, [])
  );

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setModalVisible(false);
  };

  return (
    <View style={tripstyle.container}>
      <Text style={tripstyle.title}>Assigned Trip Details</Text>
      <View style={tripstyle.tripContainer}>
        <View style={tripstyle.tripDetails}>
          <Text style={tripstyle.label}>Destination:</Text>
          <Text style={tripstyle.value}>New York City</Text>
        </View>
        <View style={tripstyle.tripDetails}>
          <Text style={tripstyle.label}>Scheduled Departure:</Text>
          <Text style={tripstyle.value}>March 10, 2025 - 08:00 AM</Text>
        </View>
        <View style={tripstyle.tripDetails}>
          <Text style={tripstyle.label}>Estimated Time of Arrival:</Text>
          <Text style={tripstyle.value}>March 10, 2025 - 06:00 PM</Text>
        </View>
        <View style={tripstyle.tripDetails}>
          <Text style={tripstyle.label}>Status:</Text>
          <Text style={[tripstyle.value, { color: status === 'On-Going' ? 'blue' : status === 'Completed' ? 'green' : 'red' }]}>
            {status}
          </Text>
        </View>
        <TouchableOpacity style={tripstyle.button} onPress={() => setModalVisible(true)}>
          <Text style={tripstyle.buttonText}>Change Status</Text>
        </TouchableOpacity>

          
      </View>
      
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={tripstyle.modalContainer}>
          <View style={tripstyle.modalContent}>
            <Text style={tripstyle.modalTitle}>Select Status</Text>
            <TouchableOpacity style={tripstyle.modalButton} onPress={() => handleStatusChange('On-Going')}>
              <Text style={tripstyle.modalButtonText}>On-Going</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tripstyle.modalButton} onPress={() => handleStatusChange('Completed')}>
              <Text style={tripstyle.modalButtonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tripstyle.modalButton} onPress={() => handleStatusChange('No Show')}>
              <Text style={tripstyle.modalButtonText}>No Show</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tripstyle.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={tripstyle.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

export default Trips;