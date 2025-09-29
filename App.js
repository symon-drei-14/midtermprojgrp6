import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, Text, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import NotificationService from './src/services/NotificationService';

import Login from "./src/screens/Login";
import Dashboard from "./src/screens/Dashboard";
import Register from "./src/screens/Register";
import Trips from "./src/screens/Trips";
import Expenses from "./src/screens/Expenses";
import Profile from "./src/screens/Profile";
import Notifications from "./src/screens/Notifications";

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);
  const navigationRef = React.useRef();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await checkAuthState();

      const initialized = await NotificationService.initialize();
      console.log('Notification service initialized:', initialized);

      if (initialized) {
        NotificationService.addListener((data) => {
          handleNotificationEvent(data);
        });
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const handleNotificationEvent = (data) => {
    console.log('Notification event received:', data);

    if (data.type === 'navigate_to_trip' && navigationRef.current) {
      navigationRef.current?.navigate('Trips', { 
        tripId: data.tripId,
        focusTrip: true 
      });
    }
  };

  const checkAuthState = async () => {
    try {
      const firebaseUser = auth().currentUser;
      
      if (firebaseUser) {
        const userData = {
          userId: firebaseUser.uid,
          email: firebaseUser.email,
          driverName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          tripId: `trip_${Date.now()}`,
          truckId: `truck_${Date.now()}`
        };
        
        setUserSession(userData);
        setIsAuthenticated(true);

        await NotificationService.registerTokenWithBackend(userData.userId);
      } else {
        const storedSession = await AsyncStorage.getItem('userSession');
        
        if (storedSession) {
          const userData = JSON.parse(storedSession);

          const sessionTimestamp = userData.loginTimestamp || 0;
          const currentTime = Date.now();
          const sessionDuration = 7 * 24 * 60 * 60 * 1000; 
          
          if (currentTime - sessionTimestamp < sessionDuration) {
            setUserSession(userData);
            setIsAuthenticated(true);

            await NotificationService.registerTokenWithBackend(userData.userId);
          } else {
            await AsyncStorage.removeItem('userSession');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userData = {
          userId: user.uid,
          email: user.email,
          driverName: user.displayName || user.email.split('@')[0],
          tripId: `trip_${Date.now()}`,
          truckId: `truck_${Date.now()}`
        };
        
        setUserSession(userData);
        setIsAuthenticated(true);

        await NotificationService.registerTokenWithBackend(userData.userId);
      } else if (!userSession) {
        setIsAuthenticated(false);
      }
    });

    return subscriber;
  }, [userSession]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        await auth().signOut();
      }

      await AsyncStorage.removeItem('userSession');
      await AsyncStorage.removeItem('fcm_token');

      setIsAuthenticated(false);
      setUserSession(null);
      
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (userData) => {
    setIsAuthenticated(true);
    setUserSession(userData);

    await NotificationService.registerTokenWithBackend(userData.userId);
  };

  const screenOptions = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
    cardStyle: {
      backgroundColor: '#FFFAF3',
    },
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: 400, 
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: 20, 
          useNativeDriver: true,
        },
      },
    },
    gestureEnabled: false,
  };

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
            screenOptions={screenOptions} 
          >
            {isAuthenticated ? (
              <>
                <Stack.Screen name="Dashboard">
                  {(props) => <Dashboard {...props} route={{
                    ...props.route,
                    params: {
                      ...props.route.params,
                      ...userSession,
                      onLogout: handleLogout 
                    }
                  }} />}
                </Stack.Screen>
                <Stack.Screen name="Trips">
                  {(props) => <Trips {...props} route={{
                    ...props.route,
                    params: {
                      ...props.route.params,
                      ...userSession,
                      onLogout: handleLogout 
                    }
                  }} />}
                </Stack.Screen>
                <Stack.Screen name="Expenses">
                  {(props) => <Expenses {...props} route={{
                    ...props.route,
                    params: {
                      ...props.route.params,
                      ...userSession,
                      onLogout: handleLogout 
                    }
                  }} />}
                </Stack.Screen>
                <Stack.Screen name="Profile">
                  {(props) => <Profile {...props} route={{
                    ...props.route,
                    params: {
                      ...props.route.params,
                      ...userSession,
                      onLogout: handleLogout 
                    }
                  }} />}
                </Stack.Screen>
                <Stack.Screen name="Notifications">
                  {(props) => <Notifications {...props} route={{
                    ...props.route,
                    params: {
                      ...props.route.params,
                      ...userSession,
                      onLogout: handleLogout 
                    }
                  }} />}
                </Stack.Screen>
              </>
            ) : (
              <>
                <Stack.Screen name="Login">
                  {(props) => <Login {...props} onLoginSuccess={handleLoginSuccess} setUserSession={setUserSession} />}
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