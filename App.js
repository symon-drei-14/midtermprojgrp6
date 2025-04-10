import "react-native-gesture-handler"; // Important: Import at the top!
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Login from "./src/screens/Login";
import Dashboard from "./src/screens/Dashboard";
import Register from "./src/screens/Register";
import Trips from "./src/screens/Trips"
import Expenses from "./src/screens/Expenses";
import Profile from "./src/screens/Profile";
import Message from "./src/screens/Message";

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider style={{ flexGrow: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Trips" component={Trips} />
            <Stack.Screen name="Expenses" component={Expenses} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Message" component={Message} />
          
          
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;

