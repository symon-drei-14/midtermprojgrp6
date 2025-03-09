import { StyleSheet } from "react-native";
import { red100 } from "../../node_modules/react-native-paper/lib/typescript/styles/themes/v2/colors";

export const loginstyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
  },
  innerContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5, 
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
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 16,
  },
  text2: {
    fontSize: 24,
    marginVertical: 20, 
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20, 
    color: 205781,
  },
  buttonD: {
    flex: 1, 
    marginHorizontal: 5, 
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
    marginLeft: 5, 
  },

  greetingContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  greetingText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "110%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navIcon: {
    width: 30,
    height: 30,
  },

  itemContainer: {
    position: "absolute",
    top: 180, 
    left: "5%", 
    right: "5%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 50,
    borderRadius: 15,
    elevation: 5, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },
  ContainerItem: {
    alignItems: "center",
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  itemValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  locationCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginTop: 250,
    marginHorizontal: 20,
    elevation: 5,
    width: "110%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});