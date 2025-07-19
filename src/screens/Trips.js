import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { tripstyle } from "../styles/Tripcss";
import { tripstyle2 } from "../styles/Tripcss2";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import profileicon from "../assets/profile.png";

const TripScreen = () => {
  const nav = useNavigation();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [scheduledTrips, setScheduledTrips] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);

  const API_BASE_URL = 'http://192.168.100.17/capstone-1-eb';

  const getDriverInfo = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session && session.userId && session.driverName) {
          const driver = {
            driver_id: session.userId,
            name: session.driverName,
          };
          setDriverInfo(driver);
          return driver;
        }
      }
    } catch (error) {
      console.error('Error getting driver info:', error);
    }
    return null;
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      let driver = driverInfo;
      if (!driver) {
        driver = await getDriverInfo();
        if (!driver) return;
      }

      const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_trips_with_drivers',
          driver_id: driver.driver_id,
          driver_name: driver.name,
        })
      });

      const data = await response.json();

      if (data.success) {
        const allTrips = data.trips || [];
        const activeTrip = allTrips.find(trip => trip.status === 'En Route');
        const pending = allTrips.filter(trip => trip.status === 'Pending');
        setCurrentTrip(activeTrip);
        setScheduledTrips(pending);
        if (activeTrip) setStatus(activeTrip.status);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTripStatus = async (newStatus, tripId) => {
    if (!currentTrip) return;
    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update_trip_status',
          trip_id: tripId || currentTrip.trip_id,
          status: newStatus,
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatus(newStatus);
        setCurrentTrip(prev => ({ ...prev, status: newStatus }));
        if (newStatus === 'Completed' || newStatus === 'No Show') fetchTrips();
      }
    } catch (error) {
      console.error('Error updating trip:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setModalVisible(false);
    updateTripStatus(newStatus);
  };

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const driver = await getDriverInfo();
        if (driver) fetchTrips();
      };
      init();
    }, [])
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={[tripstyle2.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tripstyle2.container}>
      <ScrollView contentContainerStyle={tripstyle2.scrollContainer}>
        {/* Trip Info */}
        {currentTrip ? (
          <View style={tripstyle2.tripCard}>
            <Text style={tripstyle2.tripTitle}>Trip to {currentTrip.destination}</Text>
            <Text style={tripstyle2.detailText}>Date: {formatDate(currentTrip.date)}</Text>
            <Text style={tripstyle2.detailText}>Truck: {currentTrip.plate_no}</Text>
            <Text style={tripstyle2.detailText}>Container: {currentTrip.container_no}</Text>
            <Text style={tripstyle2.detailText}>Client: {currentTrip.client}</Text>
            <Text style={tripstyle2.detailText}>Consignee: {currentTrip.consignee}</Text>
            <Text style={tripstyle2.infoText}>Cash Advance: ₱{currentTrip.cash_adv || '0'}</Text>
            <Text style={tripstyle2.infoText}>Helper: {currentTrip.helper || 'N/A'}</Text>
            <Text style={tripstyle2.infoText}>Dispatcher: {currentTrip.dispatcher}</Text>
            <Text style={tripstyle2.infoText}>Size: {currentTrip.size}</Text>
            <Text style={tripstyle2.infoText}>Status: {status}</Text>

            <View style={tripstyle2.buttonContainer}>
              <TouchableOpacity style={tripstyle2.updateButton} onPress={() => setModalVisible(true)}>
                <Text style={tripstyle2.buttonText}>{updating ? 'Updating...' : 'Update Status'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tripstyle2.expenseButton} onPress={() => nav.navigate('Expenses', { tripId: currentTrip.trip_id })}>
                <Text style={tripstyle2.buttonText}>Report Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={tripstyle2.tripCard}>
            <Text style={tripstyle2.tripTitle}>No Active Trip</Text>
          </View>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={tripstyle.modalContainer}>
            <View style={tripstyle.modalContent}>
              <Text style={tripstyle.modalTitle}>Update Trip Status</Text>
              <TouchableOpacity style={tripstyle.modalButton} onPress={() => handleStatusChange('En Route')}>
                <Text style={tripstyle.modalButtonText}>🚛 En Route</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tripstyle.modalButton} onPress={() => handleStatusChange('Completed')}>
                <Text style={tripstyle.modalButtonText}>✅ Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tripstyle.modalButton} onPress={() => handleStatusChange('No Show')}>
                <Text style={tripstyle.modalButtonText}>❌ No Show</Text>
              </TouchableOpacity>
              <TouchableOpacity style={tripstyle.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={tripstyle.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={tripstyle2.futureTripsTitle}>Scheduled Trips</Text>

        {scheduledTrips.length > 0 ? (
          <FlatList
            data={scheduledTrips}
            keyExtractor={(item) => item.trip_id.toString()}
            renderItem={({ item }) => (
              <View style={tripstyle2.futureTripCard}>
                <Text style={tripstyle2.tripTitle}>{item.destination}</Text>
                <Text style={tripstyle2.detailText}>Date: {formatDate(item.date)}</Text>
                <Text style={tripstyle2.detailText}>Truck: {item.plate_no}</Text>
                <Text style={tripstyle2.detailText}>Container: {item.container_no}</Text>
                <Text style={tripstyle2.detailText}>Client: {item.client}</Text>
                <Text style={tripstyle2.detailText}>💰 Cash Advance: ₱{item.cash_adv || '0'}</Text>
              </View>
            )}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}
          />
        ) : (
          <View style={tripstyle2.futureTripCard}>
            <Text style={tripstyle2.infoText}>No scheduled trips.</Text>
          </View>
        )}
      </ScrollView>

      <View style={navbar.bottomNav2}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")}> <Image source={homeIcon} style={navbar.navIcon} /> </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Trips")}> <Image source={userIcon} style={navbar.navIcon} /> </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Profile")}> <Image source={profileicon} style={navbar.navIcon} /> </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripScreen;