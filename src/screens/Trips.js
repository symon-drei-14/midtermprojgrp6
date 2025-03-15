import React, { useState, useCallback, } from 'react';
import { View, Text, TouchableOpacity, Modal,Image } from 'react-native';
import { useFocusEffect,useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";

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
    <View style={loginstyle.trip.container}>
      <Text style={loginstyle.trip.title}>Assigned Trip Details</Text>
      <View style={loginstyle.trip.tripContainer}>
        <View style={loginstyle.trip.tripDetails}>
          <Text style={loginstyle.trip.label}>Destination:</Text>
          <Text style={loginstyle.trip.value}>New York City</Text>
        </View>
        <View style={loginstyle.trip.tripDetails}>
          <Text style={loginstyle.trip.label}>Scheduled Departure:</Text>
          <Text style={loginstyle.trip.value}>March 10, 2025 - 08:00 AM</Text>
        </View>
        <View style={loginstyle.trip.tripDetails}>
          <Text style={loginstyle.trip.label}>Estimated Time of Arrival:</Text>
          <Text style={loginstyle.trip.value}>March 10, 2025 - 06:00 PM</Text>
        </View>
        <View style={loginstyle.trip.tripDetails}>
          <Text style={loginstyle.trip.label}>Status:</Text>
          <Text style={[loginstyle.trip.value, { color: status === 'On-Going' ? 'blue' : status === 'Completed' ? 'green' : 'red' }]}>
            {status}
          </Text>
        </View>
        <TouchableOpacity style={loginstyle.trip.button} onPress={() => setModalVisible(true)}>
          <Text style={loginstyle.trip.buttonText}>Change Status</Text>
        </TouchableOpacity>

          
      </View>
      
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={loginstyle.trip.modalContainer}>
          <View style={loginstyle.trip.modalContent}>
            <Text style={loginstyle.trip.modalTitle}>Select Status</Text>
            <TouchableOpacity style={loginstyle.trip.modalButton} onPress={() => handleStatusChange('On-Going')}>
              <Text style={loginstyle.trip.modalButtonText}>On-Going</Text>
            </TouchableOpacity>
            <TouchableOpacity style={loginstyle.trip.modalButton} onPress={() => handleStatusChange('Completed')}>
              <Text style={loginstyle.trip.modalButtonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={loginstyle.trip.modalButton} onPress={() => handleStatusChange('No Show')}>
              <Text style={loginstyle.trip.modalButtonText}>No Show</Text>
            </TouchableOpacity>
            <TouchableOpacity style={loginstyle.trip.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={loginstyle.trip.cancelButtonText}>Cancel</Text>
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