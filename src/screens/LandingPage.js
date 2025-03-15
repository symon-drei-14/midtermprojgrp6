import React from "react";
import { Text, View, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";

function LandingPage({ navigation }) {
  return (

    <ImageBackground source={require("../assets/background.png")} style={styles.background}>
      <View style={styles.container}>
       
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}




export default LandingPage;


// import React from "react";
// import { Text, View } from "react-native";

// function LandingPage() {
//   return (
//     <View>
//       <Text>Hello, React Native! bitchass</Text>
//     </View>
//   );
// }

// export default LandingPage;