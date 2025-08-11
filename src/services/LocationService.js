import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { Alert, Platform, Linking, PermissionsAndroid } from 'react-native';

class LocationService {
  constructor() {
    this.locationTimer = null;
    this.isTracking = false;
    this.updateInterval = 10; 
    this.sensorEnabled = false;
    this.userId = null;
    this.listeners = new Set();
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }

  async requestLocationPermission() {
    if (Platform.OS === 'ios') {
      return true;
    }
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to track your trips.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, heading } = position.coords;
          resolve({ latitude, longitude, heading });
        },
        error => {
          reject(error);
        },
        {
          enableHighAccuracy: this.sensorEnabled,
          timeout: 20000,
          maximumAge: 1000
        }
      );
    });
  }

  async updateDriverStatus(status) {
    if (!this.userId) {
      console.error('No user ID available for status update');
      return;
    }

    try {
      await database().ref(`/drivers/${this.userId}/status`).set({
        status: status, 
        last_status_update: database.ServerValue.TIMESTAMP
      });
      
      console.log(`Driver status updated to: ${status}`);
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  }

  async updateLocation() {
    if (!this.isTracking) return;

    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        this.notifyListeners({ 
          status: 'Permission denied',
          error: 'Location permission required' 
        });
        return;
      }

      this.notifyListeners({ status: 'Updating...' });

      const { latitude, longitude, heading } = await this.getCurrentLocation();
      
      console.log(`Location updated: ${latitude}, ${longitude}, heading: ${heading}`);
      
      await this.storeLocationToFirebase(latitude, longitude, heading);
      
      const now = new Date();
      const formattedTime = now.toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });

      this.notifyListeners({
        status: 'Updated',
        location: { latitude, longitude, heading },
        lastUpdated: formattedTime,
        address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      });

      setTimeout(() => {
        if (this.isTracking) {
          this.notifyListeners({ status: 'Online' }); 
        }
      }, 2000);

    } catch (error) {
      console.log('Error getting location:', error);
      this.notifyListeners({ 
        status: `Error: ${error.code}`,
        error: error.message 
      });

      if (error.code === 3) {
        try {
          const position = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000
              }
            );
          });
          
          const { latitude, longitude } = position.coords;
          await this.storeLocationToFirebase(latitude, longitude);
          this.notifyListeners({ 
            status: 'Updated (Lower Accuracy)',
            location: { latitude, longitude }
          });
        } catch (fallbackError) {
          console.log("Fallback location failed:", fallbackError);
          this.notifyListeners({ status: 'Location Unavailable' });
        }
      }
      
      setTimeout(() => {
        if (this.isTracking) {
          this.notifyListeners({ status: 'Online' });
        }
      }, 2000);
    }
  }

  async storeLocationToFirebase(latitude, longitude, heading = 0) {
    if (!this.userId) {
      console.error('No user ID available for location storage');
      return;
    }

    try {
      await database().ref(`/drivers/${this.userId}/location`).set({
        latitude,
        longitude,
        heading,
        last_updated: database.ServerValue.TIMESTAMP
      });
      
      console.log("Location successfully updated in Firebase");
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  }

  startTracking(userId, updateInterval = 10, sensorEnabled = false) {
    if (this.isTracking) {
      this.stopTracking();
    }

    this.userId = userId;
    this.updateInterval = updateInterval;
    this.sensorEnabled = sensorEnabled;
    this.isTracking = true;

    console.log(`Starting location tracking with interval: ${updateInterval} seconds...`);

    this.updateDriverStatus('online');

    this.updateLocation();

    const intervalInMs = updateInterval * 1000;
    this.locationTimer = setInterval(() => {
      console.log(`Interval triggered for location update (every ${updateInterval}s)`);
      this.updateLocation();
    }, intervalInMs);

    this.notifyListeners({ status: 'Online', isTracking: true }); 
  }

  stopTracking() {
    console.log("Stopping location tracking...");
    
    if (this.locationTimer) {
      clearInterval(this.locationTimer);
      this.locationTimer = null;
    }
    
    this.isTracking = false;
    
    this.updateDriverStatus('offline');
    
    this.notifyListeners({ status: 'Offline', isTracking: false }); 
  }

  updateSettings(updateInterval, sensorEnabled) {
    this.updateInterval = updateInterval;
    this.sensorEnabled = sensorEnabled;

    if (this.isTracking) {
      this.startTracking(this.userId, updateInterval, sensorEnabled);
    }
  }

  getTrackingStatus() {
    return {
      isTracking: this.isTracking,
      updateInterval: this.updateInterval,
      sensorEnabled: this.sensorEnabled,
      userId: this.userId,
      driverStatus: this.isTracking ? 'online' : 'offline' 
    };
  }

  async getCurrentDriverStatus() {
    if (!this.userId) return 'offline';
    
    try {
      const snapshot = await database().ref(`/drivers/${this.userId}/status`).once('value');
      const statusData = snapshot.val();
      return statusData?.status || 'offline';
    } catch (error) { 
      console.error('Error getting driver status:', error);
      return 'offline';
    }
  }
}

export default new LocationService();