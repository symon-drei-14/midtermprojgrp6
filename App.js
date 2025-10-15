import "react-native-gesture-handler";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, Text, AppState } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import NotificationService from './src/services/NotificationService';
import LocationService from './src/services/LocationService';
import BackgroundFetch from 'react-native-background-fetch';

import Login from "./src/screens/Login";
import Dashboard from "./src/screens/Dashboard";
import Register from "./src/screens/Register";
import Trips from "./src/screens/Trips";
import Expenses from "./src/screens/Expenses";
import Profile from "./src/screens/Profile";
import Notifications from "./src/screens/Notifications";

const Stack = createStackNavigator();

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

const SCREEN_OPTIONS = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  cardStyle: { backgroundColor: '#FFFAF3' },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: { duration: 400, useNativeDriver: true },
    },
    close: {
      animation: 'timing',
      config: { duration: 20, useNativeDriver: true },
    },
  },
  gestureEnabled: false,
};

const createUserData = (firebaseUser) => ({
  userId: firebaseUser.uid,
  email: firebaseUser.email,
  driverName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
  tripId: `trip_${Date.now()}`,
  truckId: `truck_${Date.now()}`,
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);
  const navigationRef = useRef();
  const appState = useRef(AppState.currentState);
  const locationInitialized = useRef(false);

  const handleGlobalLocationUpdate = useCallback((data) => {
    console.log('[App] Global location update:', data);
  }, []);

  const initializeLocationTracking = useCallback(async (userData) => {
    if (locationInitialized.current) {
      console.log('[App] Location already initialized');
      return;
    }

    try {
      await LocationService.configureBackgroundFetch();
      await BackgroundFetch.start();

      const trackingState = await AsyncStorage.getItem('locationTrackingState');
      
      if (trackingState) {
        const { isTracking, updateInterval, sensorEnabled } = JSON.parse(trackingState);
        
        if (isTracking) {
          console.log('[App] Restoring location tracking');

          const sessionData = await AsyncStorage.getItem('userSession');
          if (sessionData) {
            const session = JSON.parse(sessionData);
            const firebaseUserId = session.firebaseUserId || userData.userId;

            await LocationService.startTracking(
              firebaseUserId,
              updateInterval || 10,
              sensorEnabled || false
            );
          }
        }
      }

      LocationService.addListener(handleGlobalLocationUpdate);
      locationInitialized.current = true;

      console.log('[App] Location tracking initialized');
    } catch (error) {
      console.error('[App] Error initializing location tracking:', error);
    }
  }, [handleGlobalLocationUpdate]);

  const registerNotificationToken = useCallback(async (userId) => {
    if (userId) {
      try {
        await NotificationService.registerTokenWithBackend(userId);
      } catch (error) {
        console.error('Error registering notification token:', error);
      }
    }
  }, []);

  const setAuthenticatedUser = useCallback(async (userData) => {
    setUserSession(userData);
    setIsAuthenticated(true);
    await registerNotificationToken(userData.userId);
    await initializeLocationTracking(userData);
  }, [registerNotificationToken, initializeLocationTracking]);

  const handleNotificationEvent = useCallback((data) => {
    console.log('Notification event received:', data);
    
    if (data.type === 'navigate_to_trip' && navigationRef.current) {
      navigationRef.current.navigate('Trips', { 
        tripId: data.tripId,
        focusTrip: true 
      });
    }
  }, []);

  const checkStoredSession = useCallback(async () => {
    const storedSession = await AsyncStorage.getItem('userSession');
    
    if (!storedSession) return false;

    const userData = JSON.parse(storedSession);
    const sessionTimestamp = userData.loginTimestamp || 0;
    const currentTime = Date.now();
    
    if (currentTime - sessionTimestamp < SESSION_DURATION) {
      await setAuthenticatedUser(userData);
      return true;
    }
    
    await AsyncStorage.removeItem('userSession');
    return false;
  }, [setAuthenticatedUser]);

  const initializeApp = useCallback(async () => {
    try {
      const firebaseUser = auth().currentUser;
      
      if (firebaseUser) {
        await setAuthenticatedUser(createUserData(firebaseUser));
      } else {
        await checkStoredSession();
      }

      const initialized = await NotificationService.initialize();
      console.log('Notification service initialized:', initialized);

      if (initialized) {
        NotificationService.addListener(handleNotificationEvent);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [checkStoredSession, handleNotificationEvent, setAuthenticatedUser]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        await setAuthenticatedUser(createUserData(user));
      } else if (!userSession) {
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, [userSession, setAuthenticatedUser]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('[App] App came to foreground');

        const status = LocationService.getTrackingStatus();
        if (status.isTracking) {
          console.log('[App] Location tracking is active');
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);

      const status = LocationService.getTrackingStatus();
      if (status.isTracking) {
        console.log('[App] Stopping location tracking on logout');
        await LocationService.stopTracking();
      }

      await AsyncStorage.removeItem('locationTrackingState');

      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        await auth().signOut();
      }

      await AsyncStorage.multiRemove(['userSession', 'fcm_token']);

      if (locationInitialized.current) {
        LocationService.removeListener(handleGlobalLocationUpdate);
        locationInitialized.current = false;
      }

      setIsAuthenticated(false);
      setUserSession(null);
      
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  }, [handleGlobalLocationUpdate]);

  const handleLoginSuccess = useCallback(async (userData) => {
    await setAuthenticatedUser(userData);
  }, [setAuthenticatedUser]);

  const renderScreen = useCallback((Component, additionalProps = {}) => (props) => (
    <Component 
      {...props} 
      route={{
        ...props.route,
        params: {
          ...props.route.params,
          ...userSession,
          onLogout: handleLogout,
          ...additionalProps
        }
      }} 
    />
  ), [userSession, handleLogout]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ flexGrow: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
            screenOptions={SCREEN_OPTIONS}
          >
            {isAuthenticated ? (
              <>
                <Stack.Screen name="Dashboard" children={renderScreen(Dashboard)} />
                <Stack.Screen name="Trips" children={renderScreen(Trips)} />
                <Stack.Screen name="Expenses" children={renderScreen(Expenses)} />
                <Stack.Screen name="Profile" children={renderScreen(Profile)} />
                <Stack.Screen name="Notifications" children={renderScreen(Notifications)} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login">
                  {(props) => (
                    <Login 
                      {...props} 
                      onLoginSuccess={handleLoginSuccess}
                      setUserSession={setUserSession}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Register" component={Register} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;