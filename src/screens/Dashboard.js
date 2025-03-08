import React from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { loginstyle } from "../styles/Styles"; 
import Icon from 'react-native-vector-icons/FontAwesome';

function Dashboard({ navigation }) {
  return (
    <View style={loginstyle.container2}>
      <Text style={loginstyle.text2}>Dashboard</Text>
      <View style={loginstyle.buttonContainer}>
      <View style={loginstyle.buttonD}>
          <Button
            title="Home"
            onPress={() => navigation.navigate('Dashboard')} 
          />
        </View>
        <View style={loginstyle.buttonD}>
          <Button
            title="Trips"
            onPress={() => navigation.navigate('Trips')} 
          />
        </View>
        <View style={loginstyle.buttonD}>
          <Button
            title="Button 3"
            onPress={() => navigation.navigate('Expenses')} 
          />
        </View>
      </View>
    </View>
  );
}


export default Dashboard;