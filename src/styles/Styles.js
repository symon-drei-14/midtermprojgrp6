import { StyleSheet } from "react-native";
import { red100 } from "../../node_modules/react-native-paper/lib/typescript/styles/themes/v2/colors";

export const loginstyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6", // Light background color
  },
  innerContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  textinput: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#841584",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop:30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  container2: {
    flex: 1,
    justifyContent: 'space-between', // Distributes space between children
    alignItems: 'center',
    padding: 16,
  },
  text2: {
    fontSize: 24,
    marginVertical: 20, // Adds vertical margin
  },
  buttonContainer: {
    flexDirection: 'row', // Aligns buttons side by side
    justifyContent: 'space-around', // Distributes buttons evenly
    width: '100%',
    marginBottom: 20, // Adds margin at the bottom
    color: 205781,
  },
  buttonD: {
    flex: 1, // Allows buttons to take equal space
    marginHorizontal: 5, // Adds horizontal margin between buttons
  },

  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },

  buttonText: {
    color: '#fff',
    marginLeft: 5, // Space between icon and text
  },

  
});