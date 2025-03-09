import React, { useState,useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";



const Trips = ({ navigation }) => {
  const [status, setStatus] = useState('On-Going');
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false); // Reset modal when Trips screen is focused
    }, [])
  );

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Trip Details</Text>
      <View style={styles.tripContainer}>
        <View style={styles.tripDetails}>
          <Text style={styles.label}>Destination:</Text>
          <Text style={styles.value}>New York City</Text>
        </View>
        <View style={styles.tripDetails}>
          <Text style={styles.label}>Scheduled Departure:</Text>
          <Text style={styles.value}>March 10, 2025 - 08:00 AM</Text>
        </View>
        <View style={styles.tripDetails}>
          <Text style={styles.label}>Estimated Time of Arrival:</Text>
          <Text style={styles.value}>March 10, 2025 - 06:00 PM</Text>
        </View>
        <View style={styles.tripDetails}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, { color: status === 'On-Going' ? 'blue' : status === 'Completed' ? 'green' : 'red' }]}>
            {status}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Change Status</Text>
        </TouchableOpacity>
      </View>
      
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Status</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleStatusChange('On-Going')}>
              <Text style={styles.modalButtonText}>On-Going</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleStatusChange('Completed')}>
              <Text style={styles.modalButtonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleStatusChange('No Show')}>
              <Text style={styles.modalButtonText}>No Show</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tripContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tripDetails: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Trips;