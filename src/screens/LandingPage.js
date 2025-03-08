import React from "react";
import { Text, View, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";

function LandingPage({ navigation }) {
  return (
    <ImageBackground source={require("../assets/background.png")} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
      marginTop: 700,
      Horizontal: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

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