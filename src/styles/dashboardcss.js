import { StyleSheet } from "react-native";

export const dashboardstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#e6ecec",
    },
    mapImage: {
      width: "100%",
      height: 400, 
      position: "absolute",
      top: 0,
      zIndex: -1, 
  },
  card: {
      backgroundColor: "white",
      marginHorizontal: 15,
      padding: 15,
      borderRadius: 15,
      elevation: 5,
      marginTop: 350, 
  },
    label: {
        fontSize: 14,
        color: "#888",
        marginTop: 10,
    },
    input: {
        fontSize: 16,
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        marginBottom: 10,
    },
    coordinates: {
        fontSize: 14,
        fontFamily: "monospace",
        marginTop: 5,
    }
});