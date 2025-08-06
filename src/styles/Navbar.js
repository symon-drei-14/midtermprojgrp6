import { StyleSheet } from "react-native";

export const navbar = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "400",
    backgroundColor: "#fff",
    paddingVertical: 20, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft:6,
  },

  bottomNav2: {
    position: "absolute",
    bottom: 0,
    width: "380",
    backgroundColor: "#fff",
    paddingVertical: 5, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft: 0,

  },
  navIcon: {
    resizeMode: "contain", 
    height: 70, 
    width: 70, 
    flex: 1, 
  },
});