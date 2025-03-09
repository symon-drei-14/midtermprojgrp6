import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Trips= ({navigation}) => {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Assigned Trip Details</Text>
          <View style={styles.tripContainer}>
            <View style={styles.tripDetails}>
              <Text style={styles.label}>Destination:</Text>
              <Text style={styles.value}>New York City</Text>
            </View>
            <View style={styles.tripDetails}>
              <Text style={styles.label}>Trip ID:</Text>
              <Text style={styles.value}>TRP12345</Text>
            </View>
            <View style={styles.tripDetails}>
              <Text style={styles.label}>Scheduled Departure:</Text>
              <Text style={styles.value}>March 10, 2025 - 08:00 AM</Text>
            </View>
            <View style={styles.tripDetails}>
              <Text style={styles.label}>Estimated Time of Arrival:</Text>
              <Text style={styles.value}>March 10, 2025 - 06:00 PM</Text>
            </View>
          </View>
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
        flexDirection: 'column',  // Stack label and value
        marginBottom: 10,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      value: {
        fontSize: 16,
        color: '#333',
        flexWrap: 'wrap',  // Allow wrapping
        flexShrink: 1,     // Prevent overflow
      },
    });
export default Trips;
