import React, { useState, useCallback, } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Image
} from "react-native";

import { useFocusEffect,useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { tripstyle } from "../styles/Tripcss";
import { tripstyle2 } from "../styles/Tripcss2";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import locationIcon from "../assets/exp2.png";
import profileicon from "../assets/profile.png"
const trips = [
  {
    id: "1",
    destination: "Trip to Jerusalem",
    date: "March 20, 2025",
    time: "11:00 PM",
    expectedArrival: "5:00 AM",
  },
  {
    id: "2",
    destination: "Trip to Jerusalem",
    date: "March 20, 2025",
    time: "11:00 PM",
    expectedArrival: "5:00 AM",
  },
];

 

const TripScreen = () => {
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

    <View style={tripstyle2.container}>
      <ScrollView contentContainerStyle={tripstyle2.scrollContainer}>
   
        <View style={tripstyle2.tripCard}>
          <Text style={tripstyle2.tripTitle}>Trip to Manila</Text>
          <Text style={tripstyle2.detailText}>Date : March 20, 2025</Text>
          <Text style={tripstyle2.detailText}>Time : 11:00 PM</Text>
          <Text style={tripstyle2.detailText}>Expected Arrival : 5:00 AM</Text>

          <Text style={tripstyle2.infoText}>Alloted budget : 232909402942</Text>
          <Text style={tripstyle2.infoText}>Alloted Fuel budget : 2309329042</Text>
          <Text style={tripstyle2.infoText}>Dispatcher : Symon</Text>
          <View style={tripstyle.tripDetails}>
                    {/* <Text  style={tripstyle2.infoText}>Status:
                    style={[tripstyle.value, { color: status === 'On-Going' ? 'blue' : status === 'Completed' ? 'green' : 'red' }]}
                      {status}
                    </Text> */}
                    <Text
  style={[ tripstyle2.infoText,  { color: status === 'On-Going' ? 'blue' : status === 'Completed' ? 'green' : 'red' }]}
>Status: {status} </Text>
                  </View>

        
          <View style={tripstyle2.buttonContainer}>
          <TouchableOpacity style={tripstyle2.updateButton} onPress={() => setModalVisible(true)}>
  <Text style={tripstyle2.buttonText}>Update Status</Text>
</TouchableOpacity>
<TouchableOpacity
      style={tripstyle2.expenseButton}
      onPress={() => nav.navigate('Expenses')}
    >
      <Text style={tripstyle2.buttonText}>Report Expense</Text>
    </TouchableOpacity>
          </View>
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


 
        <Text style={tripstyle2.futureTripsTitle}> ― ― ― ― ― Scheduled Trips ― ― ― ― ―</Text>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tripstyle2.futureTripCard}>
              <Text style={tripstyle2.tripTitle}>{item.destination}</Text>
              <Text style={tripstyle2.detailText}>Date : {item.date}</Text>
              <Text style={tripstyle2.detailText}>Time : {item.time}</Text>
              <Text style={tripstyle2.detailText}>
                🚗 Expected Arrival : {item.expectedArrival}
              </Text>
            </View>
          )}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={false} 
        />
      </ScrollView>

      
      

   <View style={navbar.bottomNav2}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
          <Image source={homeIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Trips")}>
          <Image source={userIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => nav.navigate("Expenses")}>
          <Image source={locationIcon} style={navbar.navIcon} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => nav.navigate("Profile")}>
          <Image source={profileicon} style={navbar.navIcon} />
        </TouchableOpacity>
        </View>
    </View>

  );
};



export default TripScreen;
