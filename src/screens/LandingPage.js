import React from "react";
import { Text, View, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";

function LandingPage({ navigation }) {
  return (
    // yung background bakit naman may proceed to view your status ? confusing
    <ImageBackground source={require("../assets/background.png")} style={styles.background}>
      <View style={styles.container}>
        {/* bakit nakalagay sign in tapos register ang navigation ? again confusing much better if dalawang button nalang one for register one for login */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// may styles kayo dito at the same time gumagamit kayo ng global styles pagisahin niyo nalang

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