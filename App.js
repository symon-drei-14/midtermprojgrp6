import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import Login from "./src/screens/Login";
import Dashboard from "./src/screens/Dashboard";
import Register from "./src/screens/Register";
import Trips from "./src/screens/Trips";
import Expenses from "./src/screens/Expenses";
import Profile from "./src/screens/Profile";
import Message from "./src/screens/Message";

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

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
    const subscriber = auth().onAuthStateChanged((user) => {
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

      setIsAuthenticated(false);
      setUserSession(null);
      
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#FFFAF3' 
          }}>
            <ActivityIndicator size="large" color="#478843" />
            <Text style={{ 
              marginTop: 20, 
              fontSize: 16, 
              color: '#666' 
            }}>
              Loading...
            </Text>
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flexGrow: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? "Dashboard" : "Login"}
            screenOptions={{ headerShown: false }}
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
                <Stack.Screen name="Message">
                  {(props) => <Message {...props} route={{
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
                  {(props) => <Login {...props} onLoginSuccess={setIsAuthenticated} setUserSession={setUserSession} />}
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