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
import { tripstyle } from "../styles/Tripcss";
import { navbar } from "../styles/Navbar";

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

  const API_BASE_URL = 'http://192.168.0.100/capstone-1-eb';

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
      year: 'numeric', month: 'long', day: 'numeric'
    });
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
      </View>

      <ScrollView 
        style={tripstyle.scrollContainer}
        contentContainerStyle={tripstyle.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Trip Section */}
        <View style={tripstyle.sectionContainer}>
          <View style={tripstyle.sectionHeader}>
            {currentTrip && (
              <View style={[tripstyle.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                <Text style={tripstyle.statusText}>{status}</Text>
              </View>
            )}
          </View>

          {currentTrip ? (
            <View style={tripstyle.activeCard}>
              <View style={tripstyle.cardHeader}>
                <View style={tripstyle.destinationContainer}>
                  <Text style={tripstyle.destinationIcon}>🎯</Text>
                  <Text style={tripstyle.destinationText}>{currentTrip.destination}</Text>
                </View>
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
                  <Text style={tripstyle.detailLabel}>📦 Container</Text>
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
                  <Text style={tripstyle.detailLabel}>💰 Cash Advance</Text>
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
                    {updating ? 'Updating...' : '🔄 Update Status'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tripstyle.secondaryButton}
                  onPress={() => nav.navigate('Expenses', { tripId: currentTrip.trip_id })}
                >
                  <Text style={tripstyle.secondaryButtonText}>💸 Report Expense</Text>
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
                      <Text style={tripstyle.destinationIcon}>📍</Text>
                      <Text style={tripstyle.scheduledDestination}>{item.destination}</Text>
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
                      <Text style={tripstyle.scheduledLabel}>🚛 {item.plate_no}</Text>
                      <Text style={tripstyle.scheduledLabel}>📦 {item.container_no}</Text>
                    </View>
                    <View style={tripstyle.detailRow}>
                      <Text style={tripstyle.scheduledLabel}>🏢 {item.client}</Text>
                    </View>
                    <View style={tripstyle.cashRow}>
                      <Text style={tripstyle.cashAdvanceLabel}>💰 Cash Advance: </Text>
                      <Text style={tripstyle.cashAdvanceValue}>₱{item.cash_adv || '0'}</Text>
                    </View>
                  </View>
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