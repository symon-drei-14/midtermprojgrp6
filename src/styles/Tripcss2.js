
import { StyleSheet } from "react-native";

export const tripstyle2=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#e6ecec",
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      scrollContainer: {
        paddingBottom: 80,
      },
      tripCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        marginBottom: 20,
      },
      tripTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
      },
      detailText: {
        fontSize: 14,
        color: "#444",
        marginBottom: 5,
      },
      infoText: {
        fontSize: 14,
        color: "#444",
        marginVertical: 5,
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
      },
      updateButton: {
        backgroundColor: "#C8F4C4",
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 5,
        alignItems: "center",
      },
      expenseButton: {
        backgroundColor: "#FCE9C9",
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginLeft: 5,
        alignItems: "center",
      },
      buttonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#444",
      },
      futureTripsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
        textAlign:"center",
      },
      futureTripCard: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 10,
      },
      bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#EEE",
        paddingVertical: 15,
        borderRadius: 20,
        position: "absolute",
        bottom: 0,
        width: "100%",
      },
      navLabel: {
        fontSize: 14,
        color: "#444",
      },
      
  });