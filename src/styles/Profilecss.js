import { StyleSheet } from "react-native";

export const profilestyle = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     padding: 20,
    //     backgroundColor: "#f5f5f5", 
  
    //   },

      
    //   profileCard: {
    //     backgroundColor: "#fff",
    //     padding: 20,
    //     borderRadius: 15,
    //     shadowColor: "#000",
    //     shadowOpacity: 0.1,
    //     shadowOffset: { width: 0, height: 3 },
    //     elevation: 5,
    //     width: "100%",
    //     maxWidth: 400,
    //     alignItems: "center",
    //     bottom:40,
    //   },
    //   avatarContainer: {
    //     alignItems: "center",
    //     marginBottom: 20,
    //   },
    //   avatar: {
    //     width: 100,
    //     height: 100,
    //   },
    //   name: {
    //     fontSize: 22,
    //     fontWeight: "bold",
    //     color: "#333",
    //     marginTop: 20,
    //   },
    //   role: {
    //     fontSize: 16,
    //     color: "#666",
    //       marginTop: 10,
    //   },
    //   detailsContainer: {
    //     width: "100%",
    //     marginTop: 10,
    //   },
    //   detailTitle: {
    //     fontSize: 18,
    //     fontWeight: "bold",
    //     color: "#444",
    //     marginBottom: 8,
    //     textAlign: "center",
    //   },
    //   driverInfo: {
    //     fontSize: 14,
    //     color: "#555",
    //     marginTop: 20,
    //   },
    //   editButton: {
    //     marginTop: 20,
    //     backgroundColor: "#007bff",
    //     paddingVertical: 12,
    //     paddingHorizontal: 30,
    //     borderRadius: 8,
    //   },
    //   buttonText: {
    //     color: "#fff",
    //     fontSize: 16,
    //     fontWeight: "bold",
    //   },
    //   inputContainer: {
    //     flexDirection: "row",
    //     alignItems: "center",  
    //     justifyContent: "space-between", 
    //     // backgroundColor: "#f5f5f5", 
    //     padding: 10,
    //     borderRadius: 8,
    //     marginBottom: 10,
    // },
    

    
    // input: {
    //     flex: 1,
    //     fontSize: 16,
    //     color: "#333",
    //     backgroundColor: "transparent", 
    //     padding: 0, 
    // },
    
    // toggleText: {
    //     color: "blue",
    //     fontSize: 14,
    //     marginLeft: 10,
    // },
    
    // editButton: {
    //     backgroundColor: "blue",
    //     paddingVertical: 5,
    //     paddingHorizontal: 10,
    //     borderRadius: 5,
    //     marginLeft: 10,
    // },
    
    // editButtonText: {
    //     color: "white",
    //     fontWeight: "bold",
    // },
    
  
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "#F8F8F8",
      paddingTop: 50,
  },
  avatarContainer: {
      alignItems: "center",
      marginBottom: 20,
  },
  avatar: {
      width: 80,
      height: 80,
      borderRadius: 50,
      backgroundColor: "#EAEAEA",
  },
  infoCard: {
      width: "90%",
      backgroundColor: "#FFF",
      borderRadius: 10,
      marginTop:20,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  infoRow: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EAEAEA",
  },
  buttonContainer: {
      flexDirection: "row",
      marginTop: 60,
      justifyContent: "space-between",
  },
  changePasswordButton: {
      backgroundColor: "#FFEB99",
      padding: 12,
      borderRadius: 20,
      marginRight: 10,
      width: 140,
      alignItems: "center",
  },
  logoutButton: {
      backgroundColor: "#FFB6C1",
      padding: 12,
      borderRadius: 20,
      width: 100,
      alignItems: "center",
  },
  buttonText: {
      fontWeight: "bold",
      color: "#333",
  },
  inputContainer: {
      marginTop: 15,
      width: "90%",
      alignItems: "center",
  },
  input: {
      width: "100%",
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      backgroundColor: "#fff",
  },
  errorText: {
      color: "red",
      fontSize: 12,
      marginTop: 5,
  },
  saveButton: {
      backgroundColor: "#4CAF50",
      padding: 12,
      borderRadius: 10,
      marginTop: 10,
      width: "100%",
      alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
},
modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
},
modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
},
input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
},
errorText: {
    color: "red",
    fontSize: 12,
},
modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
},
saveButton: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
},
cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
},
});
