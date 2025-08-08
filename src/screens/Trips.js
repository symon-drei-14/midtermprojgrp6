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
  Switch,        
  TextInput,  
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tripstyle } from "../styles/Tripcss";
import { navbar } from "../styles/Navbar";

import homeIcon from "../assets/Home.png";
import userIcon from "../assets/schedule.png";
import profileicon from "../assets/profile2.png";

const TripScreen = () => {
  const nav = useNavigation();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [scheduledTrips, setScheduledTrips] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);

  const API_BASE_URL = 'http://192.168.1.6/capstone-1-eb';

  const getDriverInfo = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session?.userId && session?.driverName) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_trips_with_drivers',
          driver_id: driver.driver_id,
          driver_name: driver.name,
        }),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_trip_status',
          trip_id: tripId || currentTrip.trip_id,
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus(newStatus);
        setCurrentTrip(prev => ({ ...prev, status: newStatus }));
        if (['Completed', 'No Show'].includes(newStatus)) fetchTrips();
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
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const [checklistModalVisible, setChecklistModalVisible] = useState(false);
const [currentTripId, setCurrentTripId] = useState(null);
const [checklistData, setChecklistData] = useState({
  noFatigue: false,
  noDrugs: false,
  noDistractions: false,
  noIllness: false,
  fitToWork: false,
  alcoholTest: '',
  hoursSleep: ''
});

const submitChecklist = async () => {
  try {
    setUpdating(true);
    const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_checklist',
        trip_id: currentTripId,
        no_fatigue: checklistData.noFatigue,
        no_drugs: checklistData.noDrugs,
        no_distractions: checklistData.noDistractions,
        no_illness: checklistData.noIllness,
        fit_to_work: checklistData.fitToWork,
        alcohol_test: parseFloat(checklistData.alcoholTest) || 0,
        hours_sleep: parseFloat(checklistData.hoursSleep) || 0
      }),
    });

    const data = await response.json();
    if (data.success) {
      Alert.alert('Success', 'Checklist submitted successfully!');
      setChecklistModalVisible(false);
    } else {
      Alert.alert('Error', data.message || 'Failed to submit checklist');
    }
  } catch (error) {
    console.error('Error submitting checklist:', error);
    Alert.alert('Error', 'Failed to submit checklist');
  } finally {
    setUpdating(false);
  }
};

// Add this function to fetch checklist data
const fetchChecklistData = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_checklist',
        trip_id: tripId
      }),
    });

    const data = await response.json();
    if (data.success && data.checklist) {
      setChecklistData({
        noFatigue: Boolean(data.checklist.no_fatigue),
        noDrugs: Boolean(data.checklist.no_drugs),
        noDistractions: Boolean(data.checklist.no_distractions),
        noIllness: Boolean(data.checklist.no_illness),
        fitToWork: Boolean(data.checklist.fit_to_work),
        alcoholTest: data.checklist.alcohol_test.toString(),
        hoursSleep: data.checklist.hours_sleep.toString()
      });
    }
  } catch (error) {
    console.error('Error fetching checklist:', error);
  }
};

  const getStatusColor = (tripStatus) => {
    switch(tripStatus) {
      case 'En Route': return '#FF9800';
      case 'Completed': return '#4CAF50';
      case 'Pending': return '#2196F3';
      case 'No Show': return '#F44336';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={tripstyle.loadingContainer}>
        <View style={tripstyle.loadingContent}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={tripstyle.loadingText}>Loading trips...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tripstyle.mainContainer}>
      {/* Header Section */}
      <View style={tripstyle.headerSection}>
      <Text style={tripstyle.headerTitle}>My Trips</Text>
      <Text style={tripstyle.dateText}>
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}
    </Text>
    </View>

      <ScrollView 
        style={tripstyle.scrollContainer}
        contentContainerStyle={tripstyle.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Trip Section */}
        <View style={tripstyle.sectionContainer}>
         
          

          {currentTrip ? (
 <View style={tripstyle.activeCard}>
  <View style={tripstyle.cardHeader}>
    {/* Destination Row */}
    <View style={tripstyle.destinationRow}>
      <Text style={tripstyle.destinationIcon}>📍Destination: </Text>
      <Text style={tripstyle.destinationText}>{currentTrip.destination}</Text>
    </View>
    
    {currentTrip && (
      <View style={tripstyle.statusRow}>
        <View style={[tripstyle.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={tripstyle.statusText}>{status}</Text>
        </View>
      </View>
    )}
  </View>

              <View style={tripstyle.tripDetails}>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.detailLabel}>📅 Date</Text>
                  <Text style={tripstyle.detailValue}>{formatDate(currentTrip.date)}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.detailLabel}>🚛 Truck</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.plate_no}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.scheduledLabel}>📦 Container no.</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.container_no}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.detailLabel}>🏢 Client</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.client}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.detailLabel}>👤 Consignee</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.consignee}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.cashAdvanceLabel}>💰 Cash Advance</Text>
                  <Text style={tripstyle.cashValue}>₱{currentTrip.cash_adv || '0'}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.detailLabel}>🤝 Helper</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.helper || 'N/A'}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.detailLabel}>📋 Dispatcher</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.dispatcher}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Text style={tripstyle.detailLabel}>📏 Size</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.size}</Text>
                </View>
              </View>

              <View style={tripstyle.actionButtons}>
                <TouchableOpacity 
                  style={tripstyle.primaryButton} 
                  onPress={() => setModalVisible(true)}
                  disabled={updating}
                >
                  <Text style={tripstyle.primaryButtonText}>
                    {updating ? 'Updating...' : '🔃 Update Status'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tripstyle.secondaryButton}
                  onPress={() => nav.navigate('Expenses', { tripId: currentTrip.trip_id })}
                >
                  <Text style={tripstyle.secondaryButtonText}>📝 Report Expense</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={tripstyle.emptyCard}>
              <Text style={tripstyle.emptyIcon}>🚛</Text>
              <Text style={tripstyle.emptyTitle}>No Active Trip</Text>
              <Text style={tripstyle.emptySubtitle}>You don't have any active trips at the moment</Text>
            </View>
          )}
        </View>

        {/* Scheduled Trips Section */}
        <View style={tripstyle.sectionContainer}>
          <View style={tripstyle.sectionHeader}>
            <Text style={tripstyle.sectionTitle}>Scheduled Trips</Text>
            <View style={tripstyle.countBadge}>
              <Text style={tripstyle.countText}>{scheduledTrips.length}</Text>
            </View>
          </View>

          {scheduledTrips.length > 0 ? (
            <FlatList
              data={scheduledTrips}
              keyExtractor={(item) => item.trip_id.toString()}
              renderItem={({ item }) => (
                <View style={tripstyle.scheduledCard}>
                  <View style={tripstyle.cardHeader}>
                    <View style={tripstyle.destinationContainer}>
                      <Text style={tripstyle.scheduledDestination}>📍{item.destination}</Text>
                    </View>
                    <View style={tripstyle.pendingBadge}>
                      <Text style={tripstyle.pendingText}>Pending</Text>
                    </View>
                  </View>
                  
                  <View style={tripstyle.scheduledDetails}>
                    <View style={tripstyle.detailRow}>
                      <Text style={tripstyle.scheduledLabel}>📅 {formatDate(item.date)}</Text>
                    </View>
                    <View style={tripstyle.detailRow}>
                      <Text style={tripstyle.scheduledLabel}>🚛 Truck: {item.plate_no}</Text>
                      <Text style={tripstyle.scheduledLabel}>📦 Container no: {item.container_no}</Text>
                    </View>
                    <View style={tripstyle.detailRow}>
                      <Text style={tripstyle.scheduledLabel}>🏢 Client: {item.client}</Text>
                    </View>
                    <View style={tripstyle.cashRow}>
                      <Text style={tripstyle.cashAdvanceLabel}>💰 Cash Advance: </Text>
                      <Text style={tripstyle.cashAdvanceValue}>₱{item.cash_adv || '0'}</Text>
                    </View>
                  </View>

                   <TouchableOpacity 
        style={tripstyle.checklistButton} 
        onPress={() => {
          setCurrentTripId(item.trip_id);
          fetchChecklistData(item.trip_id);
          setChecklistModalVisible(true);
        }}
      >
        <Text style={tripstyle.checklistButtonText}>Complete Checklist</Text>
      </TouchableOpacity>
                </View>
              )}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={tripstyle.emptyCard}>
              <Text style={tripstyle.emptyIcon}>📅</Text>
              <Text style={tripstyle.emptyTitle}>No Scheduled Trips</Text>
              <Text style={tripstyle.emptySubtitle}>Your upcoming trips will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={checklistModalVisible} transparent animationType="slide">
  <View style={tripstyle.modalOverlay}>
    <View style={tripstyle.modalContainer}>
      <View style={tripstyle.modalHeader}>
        <Text style={tripstyle.modalTitle}>Good to Go Checklist</Text>
        <Text style={tripstyle.modalSubtitle}>Please complete the checklist before starting the trip</Text>
      </View>
      
      <ScrollView style={{ maxHeight: '70%' }}>
        <View style={tripstyle.checklistItem}>
          <Text style={tripstyle.checklistQuestion}>No body fatigue?</Text>
          <Switch
            value={checklistData.noFatigue}
            onValueChange={(value) => setChecklistData({...checklistData, noFatigue: value})}
          />
        </View>
        
        <View style={tripstyle.checklistItem}>
          <Text style={tripstyle.checklistQuestion}>Did not take illegal drugs?</Text>
          <Switch
            value={checklistData.noDrugs}
            onValueChange={(value) => setChecklistData({...checklistData, noDrugs: value})}
          />
        </View>
        
        <View style={tripstyle.checklistItem}>
          <Text style={tripstyle.checklistQuestion}>No mental distractions?</Text>
          <Switch
            value={checklistData.noDistractions}
            onValueChange={(value) => setChecklistData({...checklistData, noDistractions: value})}
          />
        </View>
        
        <View style={tripstyle.checklistItem}>
          <Text style={tripstyle.checklistQuestion}>No body illness?</Text>
          <Switch
            value={checklistData.noIllness}
            onValueChange={(value) => setChecklistData({...checklistData, noIllness: value})}
          />
        </View>
        
        <View style={tripstyle.checklistItem}>
          <Text style={tripstyle.checklistQuestion}>Fit to work?</Text>
          <Switch
            value={checklistData.fitToWork}
            onValueChange={(value) => setChecklistData({...checklistData, fitToWork: value})}
          />
        </View>
        
        <View style={tripstyle.checklistItem}>
          <Text style={tripstyle.checklistQuestion}>Alcohol test reading (goal is 0):</Text>
          <TextInput
            style={tripstyle.checklistInput}
            keyboardType="numeric"
            value={checklistData.alcoholTest}
            onChangeText={(text) => setChecklistData({...checklistData, alcoholTest: text})}
            placeholder="0.00"
          />
        </View>
        
        <View style={tripstyle.checklistItem}>
          <Text style={tripstyle.checklistQuestion}>Number of hours sleep (goal is 6-9 hours):</Text>
          <TextInput
            style={tripstyle.checklistInput}
            keyboardType="numeric"
            value={checklistData.hoursSleep}
            onChangeText={(text) => setChecklistData({...checklistData, hoursSleep: text})}
            placeholder="0.0"
          />
        </View>
      </ScrollView>
      
      <View style={tripstyle.modalButtons}>
        <TouchableOpacity 
          style={[tripstyle.modalButton, tripstyle.completedButton]} 
          onPress={submitChecklist}
          disabled={updating}
        >
          <Text style={tripstyle.modalButtonText}>
            {updating ? 'Submitting...' : 'Submit Checklist'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={tripstyle.modalCancelButton} 
          onPress={() => setChecklistModalVisible(false)}
        >
          <Text style={tripstyle.modalCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      {/* Status Update Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={tripstyle.modalOverlay}>
          <View style={tripstyle.modalContainer}>
            <View style={tripstyle.modalHeader}>
              <Text style={tripstyle.modalTitle}>Update Trip Status</Text>
              <Text style={tripstyle.modalSubtitle}>Choose the current status of your trip</Text>
            </View>
            
            <View style={tripstyle.modalButtons}>
              <TouchableOpacity 
                style={[tripstyle.modalButton, tripstyle.enRouteButton]} 
                onPress={() => handleStatusChange('En Route')}
              >
                <Text style={tripstyle.modalButtonIcon}>🚛</Text>
                <Text style={tripstyle.modalButtonText}>En Route</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[tripstyle.modalButton, tripstyle.completedButton]} 
                onPress={() => handleStatusChange('Completed')}
              >
                <Text style={tripstyle.modalButtonIcon}>✅</Text>
                <Text style={tripstyle.modalButtonText}>Completed</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[tripstyle.modalButton, tripstyle.noShowButton]} 
                onPress={() => handleStatusChange('No Show')}
              >
                <Text style={tripstyle.modalButtonIcon}>❌</Text>
                <Text style={tripstyle.modalButtonText}>No Show</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={tripstyle.modalCancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={tripstyle.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={navbar.bottomNav2}>
        <TouchableOpacity 
          onPress={() => nav.navigate("Dashboard")}
          style={tripstyle.navButton}
        >
          <Image source={homeIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => nav.navigate("Trips")}
          style={tripstyle.navButton}
        >
          <Image source={userIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => nav.navigate("Profile")}
          style={tripstyle.navButton}
        >
          <Image source={profileicon} style={navbar.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripScreen;