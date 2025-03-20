import { StyleSheet } from "react-native";

export const navbar = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "400",
    backgroundColor: "#fff",
    paddingVertical: 15, 
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
    paddingVertical: 15, 
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 5,
    shadowColor: '#000', 
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
    height: 60, 
    width: 60, 
    flex: 1, 
  },
});