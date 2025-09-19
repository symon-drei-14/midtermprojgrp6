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
  RefreshControl, 
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tripstyle } from "../styles/Tripcss";
import { TripDetail } from "../styles/Tripcss";
import { navbar } from "../styles/Navbar";
import { useNavigationState } from "@react-navigation/native";
import boxIcon from "../assets/box.png";
import dateIcon from "../assets/calendar.png";
import docIcon from "../assets/google-docs.png";
import peopleIcon from "../assets/people.png";
import groupIcon from "../assets/group.png";
import dollarIcon from "../assets/dollar-symbol.png";
import helperIcon from "../assets/helper.png";
import signalIcon from "../assets/signal.png";
import clockIcon from "../assets/clock.png";
import TripSkeleton from '../components/TripSkeleton';

const TripScreen = () => {
  const nav = useNavigation();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [scheduledTrips, setScheduledTrips] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);
  const state = useNavigationState((state) => state);
  const currentRoute = state.routes[state.index].name;
  const [refreshing, setRefreshing] = useState(false);
  const [tripDetailModalVisible, setTripDetailModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  
  const API_BASE_URL = 'http://192.168.100.17/capstone-1-eb';
  
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

      const tripsWithChecklistStatus = await Promise.all(pending.map(async trip => {
        const checklistResponse = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'get_checklist',
            trip_id: trip.trip_id,
          }),
        });
        const checklistData = await checklistResponse.json();
        return {
          ...trip,
          hasChecklist: checklistData.success && checklistData.checklist
        };
      }));
      
      setCurrentTrip(activeTrip);
      setScheduledTrips(tripsWithChecklistStatus);
      if (activeTrip) setStatus(activeTrip.status);
    }
  } catch (error) {
    console.error('Error fetching trips:', error);
  } finally {
    setLoading(false);
  }
};

const onRefresh = useCallback(async () => {
  setRefreshing(true);
  try {
    await fetchTrips()
  } catch (error) {
    console.error('Error refreshing:', error);
  } finally {
    setRefreshing(false);
  }
}, []);

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
    month: 'short', 
    day: 'numeric',
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
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

const isChecklistAvailable = (tripDate) => {
  const deliveryDate = new Date(tripDate);
  const now = new Date();

  // Calculate 3 hours before the trip (start of window)
  const threeHoursBefore = new Date(deliveryDate.getTime() - 3 * 60 * 60 * 1000);

  // Calculate 1 hour before the trip (end of window)
  const oneHourBefore = new Date(deliveryDate.getTime() - 1 * 60 * 60 * 1000);

  return now >= threeHoursBefore && now <= oneHourBefore;
};

const resetChecklistData = () => {
  setChecklistData({
    noFatigue: false,
    noDrugs: false,
    noDistractions: false,
    noIllness: false,
    fitToWork: false,
    alcoholTest: '',
    hoursSleep: ''
  });
};

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
      fetchTrips(); // Refresh to update checklist status
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

  const handleTripCardPress = (trip) => {
    setSelectedTrip(trip);
    setTripDetailModalVisible(true);
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
    return <TripSkeleton />;
  }

  return (
    <View style={tripstyle.mainContainer}>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      >
        <View style={tripstyle.sectionContainer}>
          {currentTrip ? (
            <View style={[tripstyle.activeCard, { paddingBottom: 0 }]}>
              <View style={tripstyle.cardHeader}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={tripstyle.destinationRow}>
                      <View style={tripstyle.locationIconContainer}>
                         <Image 
                            source={require("../assets/location.png")}
                            style={tripstyle.walletIcon}
                            resizeMode="contain"
                          />
                        </View>
                      <View style={{ flex: 1 }}>
                        <Text style={tripstyle.destinationLabel}>Destination:</Text>
                        <Text style={tripstyle.destinationText}>{currentTrip.destination}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[tripstyle.statusBadge, { borderColor: '#FF9800', borderWidth: 1, backgroundColor: '#FFF3E0' }]}>
                    <Text style={[tripstyle.statusText, { color: '#d97706' }]}>IN ROUTE</Text>
                  </View>
                </View>
              </View>

              <View style={tripstyle.tripDetails}>
                <View style={tripstyle.detailRow}>
                  <Image source={dateIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Date</Text>
                  <Text style={tripstyle.detailValue}>
                    {formatDate(currentTrip.date)}
                  </Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={docIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Plate No.</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.plate_no}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={docIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Container No.</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.container_no}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={peopleIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Client</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.client}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={groupIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Consignee</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.consignee}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={dollarIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Cash Advance</Text>
                  <Text style={tripstyle.cashValue}>P{currentTrip.total_cash_advance || currentTrip.cash_adv || '5000.00'}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={helperIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Helper</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.helper || 'N/A'}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={signalIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Dispatcher</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.dispatcher}</Text>
                </View>
                <View style={tripstyle.detailRow}>
                  <Image source={boxIcon} style={tripstyle.detailIcon} />
                  <Text style={tripstyle.detailLabel}>Size</Text>
                  <Text style={tripstyle.detailValue}>{currentTrip.size || '40'}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={tripstyle.emptyCard}>
              <Text style={tripstyle.emptyTitle}>No Active Trip</Text>
              <Text style={tripstyle.emptySubtitle}>You don't have any active trips at the moment</Text>
            </View>
          )}
        </View>

        <View style={tripstyle.actionButtons}>
                <TouchableOpacity 
                  style={tripstyle.primaryButton} 
                  onPress={() => setModalVisible(true)}
                  disabled={updating}
                >
                  <Text style={tripstyle.primaryButtonText}>
                    {updating ? 'Updating...' : 'Update Status'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tripstyle.secondaryButton}
                  onPress={() => nav.navigate('Expenses')}
                >
                  <Text style={tripstyle.secondaryButtonText}>Report Expense</Text>
                </TouchableOpacity>
        </View>

        <View style={tripstyle.sectionContainer}>
          <View style={tripstyle.sectionHeader}>
            <Text style={tripstyle.sectionTitle}>Scheduled Trips</Text>
            <View style={tripstyle.countBadge}>
              <Text style={tripstyle.countText}>{scheduledTrips.length}</Text>
            </View>
          </View>
          {scheduledTrips.length > 0 ? (
            <View>
              {scheduledTrips.map((trip, index) => (
                <TouchableOpacity 
                  key={trip.trip_id} 
                  style={tripstyle.scheduledTripCard}
                  onPress={() => handleTripCardPress(trip)}
                >
                  <View style={tripstyle.scheduledTripRow}>
                    <View style={tripstyle.scheduledTripInfo}>
                      <Text style={tripstyle.scheduledTripDestination}>{trip.destination}</Text>
                      <Text style={tripstyle.scheduledTripDate}>{formatDate(trip.date)}</Text>
                    </View>
                      <View style={tripstyle.scheduledTripStatus}>
                        <Text style={tripstyle.scheduledStatusText}>Scheduled</Text>
                        <Text style={tripstyle.arrowText}>›</Text>
                      </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={tripstyle.emptyCard}>
              <Text style={tripstyle.emptyIcon}>📅</Text>
              <Text style={tripstyle.emptyTitle}>No Scheduled Trips</Text>
              <Text style={tripstyle.emptySubtitle}>Your upcoming trips will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <Modal 
        visible={tripDetailModalVisible} 
        transparent 
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={TripDetail.overlay}>
          <View style={TripDetail.container}>
            <View style={TripDetail.header}>
              <TouchableOpacity 
                style={TripDetail.closeButton}
                onPress={() => setTripDetailModalVisible(false)}
              >
                <Text style={TripDetail.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={TripDetail.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedTrip && (
                <>
                  <View style={TripDetail.destinationHeader}>
                    <View style={TripDetail.destinationRow}>
                      <Image 
                        source={require("../assets/location.png")}
                        style={TripDetail.locationIcon}
                        resizeMode="contain"
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={TripDetail.destinationLabel}>Destination:</Text>
                        <Text style={TripDetail.destinationText}>
                          {selectedTrip.destination || "Manila Port"}
                        </Text>
                      </View>
                      <View style={TripDetail.scheduledBadge}>
                        <Text style={TripDetail.scheduledText}>Scheduled</Text>
                      </View>
                    </View>
                  </View>
                  <View style={TripDetail.timeGrid}>
                    <View style={TripDetail.timeCard}>
                      <Image source={dateIcon} style={TripDetail.timeIcon} />
                      <Text style={TripDetail.timeLabel}>Date</Text>
                      <Text style={TripDetail.timeValue}>
                        {formatDate(selectedTrip.date) || "N/A"}
                      </Text>
                    </View>
                    
                    <View style={TripDetail.timeCard}>
                      <Image source={clockIcon} style={TripDetail.timeIcon} />
                      <Text style={TripDetail.timeLabel}>Departure</Text>
                      <Text style={TripDetail.timeValue}>
                        {formatTime(selectedTrip.date)}
                      </Text>
                    </View>
                  </View>

                  <View style={TripDetail.detailsList}>
                    {[
                      { 
                        icon: docIcon, 
                        label: "Container no.", 
                        value: selectedTrip.container_no || "N/A" 
                      },
                      { 
                        icon: peopleIcon, 
                        label: "Client", 
                        value: selectedTrip.client || "N/A" 
                      },
                      { 
                        icon: groupIcon, 
                        label: "Consignee", 
                        value: selectedTrip.consignee || "N/A" 
                      },
                      { 
                        icon: dollarIcon, 
                        label: "Cash Advance", 
                        value: `₱${selectedTrip.total_cash_advance || selectedTrip.cash_adv || "N/A"}`, 
                        cash: true 
                      },
                      { 
                        icon: helperIcon, 
                        label: "Helper", 
                        value: selectedTrip.helper || "N/A" 
                      },
                      { 
                        icon: signalIcon, 
                        label: "Dispatcher", 
                        value: selectedTrip.dispatcher || "N/A" 
                      },
                      { 
                        icon: boxIcon, 
                        label: "Size", 
                        value: selectedTrip.size || "N/A" 
                      },
                    ].map((item, idx) => (
                      <View key={idx} style={TripDetail.detailItem}>
                        <View style={TripDetail.detailLeft}>
                          <Image source={item.icon} style={TripDetail.detailIcon} />
                          <Text style={TripDetail.detailLabel}>{item.label}</Text>
                        </View>
                        <Text style={item.cash ? TripDetail.detailCashValue : TripDetail.detailValue}>
                          {item.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>

            <View style={TripDetail.bottomActions}>
              <TouchableOpacity 
                style={[
                  TripDetail.startButton,
                  selectedTrip?.hasChecklist && TripDetail.startButtonCompleted,
                  !isChecklistAvailable(selectedTrip?.date) && TripDetail.startButtonDisabled
                ]}
              onPress={() => {
  if (selectedTrip?.hasChecklist || !isChecklistAvailable(selectedTrip?.date)) return;
  
  const tripDate = new Date(selectedTrip.date);
  const now = new Date();
  const threeHoursBefore = new Date(tripDate.getTime() - 3 * 60 * 60 * 1000);
  const oneHourBefore = new Date(tripDate.getTime() - 1 * 60 * 60 * 1000);

  if (now < threeHoursBefore) {
    const formattedTime = threeHoursBefore.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
    Alert.alert(
      'Checklist Not Available Yet',
      `Checklist will be available starting at ${formattedTime} (3 hours before the scheduled trip).`
    );
    return;
  }

  if (now > oneHourBefore) {
    Alert.alert(
      'Checklist Submission Closed',
      'Checklist submission closed 1 hour before the scheduled trip time.'
    );
    return;
  }

  setCurrentTripId(selectedTrip.trip_id);
  resetChecklistData();
  setTripDetailModalVisible(false);
  setChecklistModalVisible(true);
}}
              >
                <Text style={TripDetail.startButtonText}>
                  {selectedTrip?.hasChecklist 
                    ? 'Checklist Submitted' 
                    : !isChecklistAvailable(selectedTrip?.date)
                      ? 'Checklist Not Available'
                      : 'Start Trip'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
      <View style={tripstyle.bottomNav}>
        <TouchableOpacity 
          style={[tripstyle.navButton, currentRoute === "Dashboard" && tripstyle.navButtonActive]}
          onPress={() => nav.navigate("Dashboard")}
        >
          <View style={tripstyle.navIconContainer}>
            <Image 
              source={require("../assets/Home.png")} 
              style={[
                tripstyle.navIcon, 
                { tintColor: currentRoute === "Dashboard" ? "#dc2626" : "#9ca3af" }
              ]}
            />
          </View>
          <Text 
            style={[
              tripstyle.navLabel, 
              { color: currentRoute === "Dashboard" ? "#dc2626" : "#9ca3af" }
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[tripstyle.navButton, currentRoute === "Trips" && tripstyle.navButtonActive]}
          onPress={() => nav.navigate("Trips")}
        >
          <View style={tripstyle.navIconContainer}>
            <Image 
              source={require("../assets/location2.png")} 
              style={[
                tripstyle.navIcon, 
                { tintColor: currentRoute === "Trips" ? "#dc2626" : "#9ca3af" }
              ]}
            />
          </View>
          <Text 
            style={[
              tripstyle.navLabel, 
              { color: currentRoute === "Trips" ? "#dc2626" : "#9ca3af" }
            ]}
          >
            Trips
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[tripstyle.navButton, currentRoute === "Profile" && tripstyle.navButtonActive]}
          onPress={() => nav.navigate("Profile")}
        >
          <View style={tripstyle.navIconContainer}>
            <Image 
              source={require("../assets/user.png")} 
              style={[
                tripstyle.navIcon, 
                { tintColor: currentRoute === "Profile" ? "#dc2626" : "#9ca3af" }
              ]}
            />
          </View>
          <Text 
            style={[
              tripstyle.navLabel, 
              { color: currentRoute === "Profile" ? "#dc2626" : "#9ca3af" }
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripScreen;