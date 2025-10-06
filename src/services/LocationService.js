import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { getDatabase, ref, set, serverTimestamp, get } from '@react-native-firebase/database';
import { Alert, Platform, Linking, PermissionsAndroid } from 'react-native';
import BackgroundService from 'react-native-background-actions';

class LocationService {
  constructor() {
    this.locationTimer = null;
    this.isTracking = false;
    this.updateInterval = 10 * 1000;
    this.sensorEnabled = false;
    this.userId = null;
    this.listeners = new Set();
    this.activeTrip = null;
    this.routeTrackingEnabled = true;
    this.backendUrl = 'http://192.168.1.3/capstone-1-eb';
    this.lastRoutePointTime = null;
    this.routePointInterval = 30 * 60 * 1000;
    
    this.lastLocation = null;
    this.locationChangeThreshold = 0.0001;
    this.database = getDatabase();
    this.lastStatusUpdate = 0;
    this.statusUpdateThreshold = 1000;
    this.lastNotifiedStatus = null;
    this.STORAGE_KEY = 'locationService_routeTimer';

    this.isStarting = false;
    this.backgroundFetchConfigured = false;
  }

debugListeners() {
    console.log(`=== LocationService Debug ===`);
    console.log(`Listeners count: ${this.listeners.size}`);
    console.log(`Timer active: ${!!this.locationTimer} (ID: ${this.locationTimer})`);
    console.log(`Is tracking: ${this.isTracking}`);
    console.log(`User ID: ${this.userId}`);
    console.log(`Last route point time: ${this.lastRoutePointTime ? new Date(this.lastRoutePointTime).toISOString() : 'null'}`);
    console.log(`Active trip: ${this.activeTrip ? this.activeTrip.trip_id : 'none'}`);
    console.log(`=============================`);
}

  addListener(callback) {
    if (this.listeners.has(callback)) {
      console.log('Listener already exists, skipping');
      return;
    }
    this.listeners.add(callback);
    console.log(`Total listeners: ${this.listeners.size}`);

    const status = this.getTrackingStatus();
    if (status.isTracking) {
      callback({
        status: 'Online',
        isTracking: true,
        activeTrip: this.activeTrip,
        routeTracking: this.getNextRoutePointInfo()
      });
    }
  }

  removeListener(callback) {
    const removed = this.listeners.delete(callback);
    console.log(`Listener removed: ${removed}, Total listeners: ${this.listeners.size}`);
  }

  notifyListeners(data) {
      const dataString = JSON.stringify(data);
      if (this.lastNotification === dataString && Date.now() - this.lastNotificationTime < 1000) {
          return;
      }
      this.lastNotification = dataString;
      this.lastNotificationTime = Date.now();
      
      console.log(`Notifying ${this.listeners.size} listeners:`, data);
      this.listeners.forEach(callback => {
          try {
              callback(data);
          } catch (error) {
              console.error('Error in listener callback:', error);
          }
      });
  }

  emergencyReset() {
    console.log('=== EMERGENCY RESET ===');
    
    if (this.locationTimer) {
      clearInterval(this.locationTimer);
      this.locationTimer = null;
    }
    
    this.isTracking = false;
    this.userId = null;
    this.lastLocation = null;
    this.activeTrip = null;
    this.lastRoutePointTime = null;
    this.lastNotifiedStatus = null;
    
    this.listeners.clear();
    
    console.log('Emergency reset complete - all timers cleared, listeners removed');
  }

  hasLocationChanged(newLat, newLng) {
    if (!this.lastLocation) return true;
    
    const latDiff = Math.abs(newLat - this.lastLocation.latitude);
    const lngDiff = Math.abs(newLng - this.lastLocation.longitude);
    
    return latDiff > this.locationChangeThreshold || lngDiff > this.locationChangeThreshold;
  }

  debugActiveIntervals() {
    console.log('Checking for potential multiple intervals...');

    if (this.locationTimer) {
        console.log(`Current timer ID: ${this.locationTimer}`);
    } else {
        console.log('No active timer registered');
    }

    console.log(`Current listeners: ${this.listeners.size}`);
}

  async saveRouteTimerState() {
    if (this.activeTrip && this.lastRoutePointTime) {
      const state = {
        tripId: this.activeTrip.trip_id,
        lastRoutePointTime: this.lastRoutePointTime,
        savedAt: Date.now()
      };
      try {
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        console.log('Route timer state saved for trip:', this.activeTrip.trip_id);
      } catch (error) {
        console.error('Failed to save route timer state:', error);
      }
    }
  }

  async restoreRouteTimerState(tripId) {
    try {
      const saved = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        const maxAge = 24 * 60 * 60 * 1000;
        if (state.tripId === tripId && (Date.now() - state.savedAt < maxAge)) {
          this.lastRoutePointTime = state.lastRoutePointTime;
          const timeAgo = Math.floor((Date.now() - this.lastRoutePointTime) / (60 * 1000));
          console.log(`Route timer state restored: last point was ${timeAgo} minutes ago`);
          return true;
        } else {
          console.log('Saved timer state expired or different trip, starting fresh');
        }
      }
    } catch (error) {
      console.error('Failed to restore route timer state:', error);
    }
    return false;
  }

  async setActiveTrip(tripData) {
    const tripId = tripData.trip_id;
    
    if (this.activeTrip && this.activeTrip.trip_id === tripId) {
      console.log('Same trip, preserving existing timer state');
      this.activeTrip = tripData;
      
      this.notifyListeners({
        activeTrip: this.activeTrip,
        status: 'Online'
      });
      return;
    }
    
    console.log('Setting new active trip:', tripId);
    
    const restored = await this.restoreRouteTimerState(tripId);
    if (!restored) {
      console.log('No saved timer state, will start fresh on first location update');
      this.lastRoutePointTime = null;
    }
    
    this.activeTrip = tripData;
    await this.saveRouteTimerState();
    
    this.notifyListeners({
      activeTrip: this.activeTrip,
      status: 'Online'
    });
  }

   getNextRoutePointInfo() {
    if (!this.activeTrip || !this.lastRoutePointTime) {
      return 'No active trip';
    }
    
    const now = Date.now();
    const timeSinceLastPoint = now - this.lastRoutePointTime;
    const timeUntilNext = this.routePointInterval - timeSinceLastPoint;
    
    if (timeUntilNext <= 0) {
      return 'Route point due now';
    }
    
    const minutesUntilNext = Math.ceil(timeUntilNext / (60 * 1000));
    return `Next route point in ~${minutesUntilNext} min`;
  }

  clearActiveTrip() {
    this.activeTrip = null;
    this.lastRoutePointTime = null;
    console.log('Active trip cleared');

    AsyncStorage.removeItem(this.STORAGE_KEY).catch(error => {
      console.error('Failed to clear saved timer state:', error);
    });
  }

  shouldStoreRoutePoint() {
    if (!this.activeTrip || !this.routeTrackingEnabled) {
      return false;
    }

    const now = Date.now();
    
    if (!this.lastRoutePointTime) {
      this.lastRoutePointTime = now;
      return true;
    }

    if (now - this.lastRoutePointTime >= this.routePointInterval) {
      this.lastRoutePointTime = now;
      return true;
    }

    return false;
  }

  async checkForActiveTrip() {
    if (!this.userId) return;

    try {
      const response = await fetch(`${this.backendUrl}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_driver_current_trip',
          driver_id: this.userId
        }),
      });

      const data = await response.json();
      if (data.success && data.trip && data.trip.status === 'En Route') {
        await this.setActiveTrip(data.trip);
      } else {
        this.clearActiveTrip();
      }
    } catch (error) {
      console.error('Error checking for active trip:', error);
    }
  }

  async storeRoutePoint(latitude, longitude, speed = null, heading = null) {
    if (!this.activeTrip || !this.routeTrackingEnabled) {
      return;
    }

    console.log('Storing route point for trip:', this.activeTrip.trip_id);

    try {
      const response = await fetch(`${this.backendUrl}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'store_route_point',
          trip_id: this.activeTrip.trip_id,
          latitude: latitude,
          longitude: longitude,
          speed: speed,
          heading: heading,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }),
      });

      const data = await response.json();
      console.log('Route point storage:', data.success ? 'SUCCESS' : 'FAILED');

      if (data.success) {
        await this.saveRouteTimerState();
      }
      
    } catch (error) {
      console.error('Error storing route point:', error);
    }
  }

  async requestLocationPermission() {
    if (Platform.OS === 'ios') {
      return true;
    }
    
    try {
      const fineGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to track your trips.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      
      if (fineGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        return false;
      }

      if (Platform.Version >= 29) {
        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: "Background Location Permission",
            message: "To track your location while the app is in the background, please allow 'Allow all the time'.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        
        return backgroundGranted === PermissionsAndroid.RESULTS.GRANTED;
      }
      
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, heading, speed } = position.coords;
          resolve({ latitude, longitude, heading, speed });
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
      console.error('No user ID for status update');
      return;
    }

    if (!status) {
      console.error('Status is undefined, using "offline" as default');
      status = 'offline';
    }

    try {
      const statusRef = ref(this.database, `/drivers/${this.userId}/status`);
      await set(statusRef, {
        status: status,
        last_updated: serverTimestamp()
      });
      console.log(`Driver status updated: ${status}`);
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

      const { latitude, longitude, heading, speed } = await this.getCurrentLocation();

      console.log(`Location: ${latitude}, ${longitude}, heading: ${heading}, speed: ${speed}`);

      this.lastLocation = { latitude, longitude };
      await this.storeLocationToFirebase(latitude, longitude, heading);
      console.log('Location updated in Firebase');

      const now = Date.now();
      if (!this.lastRoutePointTime) {
        this.lastRoutePointTime = now;
        if (this.activeTrip) {
          await this.storeRoutePoint(latitude, longitude, speed, heading);
          console.log('Route point stored in Firebase');
        }
      } else if (this.activeTrip && now - this.lastRoutePointTime >= this.routePointInterval) {
        await this.storeRoutePoint(latitude, longitude, speed, heading);
        this.lastRoutePointTime = now;
        console.log('Route point stored in Firebase');
        await this.saveRouteTimerState();
      }

      const formattedTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });

      const nextRoutePointInfo = this.getNextRoutePointInfo();

      this.notifyListeners({
        status: 'Updated',
        location: { latitude, longitude, heading, speed },
        lastUpdated: formattedTime,
        address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        activeTrip: this.activeTrip,
        routeTracking: nextRoutePointInfo
      });

      setTimeout(() => {
        if (this.isTracking && this.lastNotifiedStatus !== 'Online') {
          this.notifyListeners({ status: 'Online' });
          this.lastNotifiedStatus = 'Online';
        }
      }, 2000);

    } catch (error) {
      console.log('Location error:', error.code, error.message);
      this.notifyListeners({
        status: `Error: ${error.code}`,
        error: error.message,
        routeTracking: this.getNextRoutePointInfo()
      });
    }
  }

  async configureBackgroundFetch() {
    if (this.backgroundFetchConfigured) return;
    try {
      const BackgroundFetch = require('react-native-background-fetch').default;
      await BackgroundFetch.configure(
        {
          minimumFetchInterval: 15,
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        },
        async (taskId) => {
          try {
            const hasPermission = await this.requestLocationPermission();
            if (hasPermission) {
              await this.updateLocation();
            }
          } catch (e) {
            console.warn('BackgroundFetch task error', e);
          } finally {
            BackgroundFetch.finish(taskId);
          }
        },
        (error) => console.warn('[BackgroundFetch] configure error:', error)
      );
      try {
        await BackgroundFetch.start();
      } catch (e) {
        console.warn('BackgroundFetch.start error', e);
      }
      try {
        await BackgroundFetch.scheduleTask({
          taskId: 'location-fetch',
          delay: 0,
          periodic: true,
          forceAlarmManager: true,
          stopOnTerminate: false,
          startOnBoot: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        });
      } catch (e) {
        console.warn('BackgroundFetch.scheduleTask error', e);
      }
      this.backgroundFetchConfigured = true;
      console.log('[BackgroundFetch] configured');
    } catch (e) {
      console.warn('Failed to configure BackgroundFetch', e);
    }
  }


  async storeLocationToFirebase(latitude, longitude, heading = 0) {
    if (!this.userId) {
      console.error('No user ID for Firebase storage');
      return;
    }

    try {
      const locationRef = ref(this.database, `/drivers/${this.userId}/location`);
      await set(locationRef, {
        latitude,
        longitude,
        heading,
        last_updated: serverTimestamp()
      });
      
    } catch (error) {
      console.error("Firebase location update error:", error);
      throw error;
    }
  }

async startTracking(userId, updateInterval = 10, sensorEnabled = false) {
    console.log(`START TRACKING REQUEST - Current state: tracking=${this.isTracking}`);

    if (this.isStarting) {
      console.log('Start tracking already in progress, ignoring request');
      return;
    }

    if (this.isTracking && this.userId === userId) {
      console.log('Already tracking with same parameters');
      return;
    }

    this.isStarting = true;

    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Background location permission is required for continuous tracking.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        this.isStarting = false;
        return;
      }

      this.userId = userId;
      this.updateInterval = updateInterval * 1000;
      this.sensorEnabled = sensorEnabled;
      this.isTracking = true;
      this.lastNotifiedStatus = null;

      console.log(`Starting tracking: ${updateInterval}s interval, sensor: ${sensorEnabled}`);

      await this.updateDriverStatus('online');
      await this.checkForActiveTrip();

      const veryIntensiveTask = async (taskDataArguments) => {
        const { delay } = taskDataArguments;
        
        await new Promise(async (resolve) => {
          console.log('[Background] Starting location tracking task');
          
          while (BackgroundService.isRunning()) {
            console.log('[Background] Updating location...');
            
            try {
              await this.updateLocation();

              if (Math.random() < 0.01) {
                await this.checkForActiveTrip();
              }
            } catch (error) {
              console.error('[Background] Update error:', error);
            }

            await new Promise(r => setTimeout(r, delay));
          }
        });
      };

      const options = {
        taskName: 'Location Tracking',
        taskTitle: 'Trip Tracking Active',
        taskDesc: 'Your location is being tracked',
        taskIcon: {
          name: 'ic_launcher',
          type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourapp://home',
        parameters: {
          delay: this.updateInterval,
        },
        progressBar: {
          max: 100,
          value: 0,
          indeterminate: true
        }
      };

      await BackgroundService.start(veryIntensiveTask, options);
      console.log('Background service started successfully');

      this.notifyListeners({ 
        status: 'Online', 
        isTracking: true,
        activeTrip: this.activeTrip,
      });

    } catch (error) {
      console.error('Error starting tracking:', error);
      this.isTracking = false;
    } finally {
      this.isStarting = false;
    }
  }
  async stopTracking() {
    console.log("Stopping location tracking");
    
    this.isTracking = false;
    this.lastLocation = null;
    this.lastNotifiedStatus = null;
    
    await this.updateDriverStatus('offline');

    try {
      await BackgroundService.stop();
      console.log('Background service stopped');
    } catch (error) {
      console.error('Error stopping background service:', error);
    }
    
    this.notifyListeners({ status: 'Offline', isTracking: false }); 
  }

async updateSettings(updateInterval, sensorEnabled) {
    this.updateInterval = updateInterval * 1000;
    this.sensorEnabled = sensorEnabled;

    if (this.isTracking) {
      await this.stopTracking();
      await this.startTracking(this.userId, updateInterval, sensorEnabled);
    }
  }

  getTrackingStatus() {
    return {
      isTracking: this.isTracking,
      updateInterval: this.updateInterval,
      sensorEnabled: this.sensorEnabled,
      userId: this.userId,
      driverStatus: this.isTracking ? 'online' : 'offline',
      activeTrip: this.activeTrip,
      routeTrackingEnabled: this.routeTrackingEnabled,
      routePointInterval: this.routePointInterval / (60 * 1000),
      lastRoutePointTime: this.lastRoutePointTime,
      nextRoutePointIn: this.lastRoutePointTime 
        ? Math.max(0, Math.ceil((this.routePointInterval - (Date.now() - this.lastRoutePointTime)) / (60 * 1000)))
        : null,
      lastLocation: this.lastLocation
    };
  }

  async getCurrentDriverStatus() {
    if (!this.userId) return 'offline';
    
    try {
      const statusRef = ref(this.database, `/drivers/${this.userId}/status`);
      const snapshot = await get(statusRef);
      const statusData = snapshot.val();
      return statusData?.status || 'offline';
    } catch (error) { 
      console.error('Error getting driver status:', error);
      return 'offline';
    }
  }

  async startTrip(tripId) {
    try {
      const response = await fetch(`${this.backendUrl}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_trip_status',
          trip_id: tripId,
          status: 'En Route'
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Trip started');
        await this.checkForActiveTrip();
        return true;
      } else {
        console.error('Failed to start trip:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error starting trip:', error);
      return false;
    }
  }

  async completeTrip(tripId) {
    try {
      const response = await fetch(`${this.backendUrl}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_trip_status',
          trip_id: tripId,
          status: 'Completed'
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Trip completed');
        this.clearActiveTrip();
        return true;
      } else {
        console.error('Failed to complete trip:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error completing trip:', error);
      return false;
    }
  }

  toggleRouteTracking(enabled) {
    this.routeTrackingEnabled = enabled;
    console.log(`Route tracking ${enabled ? 'enabled' : 'disabled'}`);
    
    this.notifyListeners({
      routeTrackingEnabled: this.routeTrackingEnabled
    });
  }

  async forceStoreRoutePoint() {
    if (!this.activeTrip) {
      console.log('No active trip for forced route point');
      return false;
    }

    try {
      const { latitude, longitude, heading, speed } = await this.getCurrentLocation();
      await this.storeRoutePoint(latitude, longitude, speed, heading);
      this.lastRoutePointTime = Date.now();
      console.log('Route point force stored');
      return true;
    } catch (error) {
      console.error('Error force storing route point:', error);
      return false;
    }
  }

  setRoutePointInterval(minutes) {
    this.routePointInterval = minutes * 60 * 1000;
    console.log(`Route point interval set to ${minutes} minutes`);
  }

  setLocationChangeThreshold(threshold) {
    this.locationChangeThreshold = threshold;
    console.log(`Location change threshold set to ${threshold}`);
  }
}

export default new LocationService();