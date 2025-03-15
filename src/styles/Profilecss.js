import { StyleSheet } from "react-native";

export const profilestyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5", 
  
      },

      
      profileCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
        bottom:40,
      },
      avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
      },
      avatar: {
        width: 100,
        height: 100,
      },
      name: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
      },
      role: {
        fontSize: 16,
        color: "#666",
          marginTop: 10,
      },
      detailsContainer: {
        width: "100%",
        marginTop: 10,
      },
      detailTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 8,
        textAlign: "center",
      },
      driverInfo: {
        fontSize: 14,
        color: "#555",
        marginTop: 20,
      },
      editButton: {
        marginTop: 20,
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
      },
      buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",  
        justifyContent: "space-between", 
        // backgroundColor: "#f5f5f5", 
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    

    
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        backgroundColor: "transparent", 
        padding: 0, 
    },
    
    toggleText: {
        color: "blue",
        fontSize: 14,
        marginLeft: 10,
    },
    
    editButton: {
        backgroundColor: "blue",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    
    editButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    
  
  
    });