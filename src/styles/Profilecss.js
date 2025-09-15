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
    
  
      
 
 
  infoRow: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EAEAEA",
  },
  buttonContainer: {
      flexDirection: "row",
      marginTop: 20,
      justifyContent: "space-between",
      textAlign: "center",
  },
  changePasswordButton: {
      backgroundColor: "#FFEB99",
      padding: 12,
      borderRadius: 20,
      marginRight: 10,
      width: 140,
      alignItems: "center",
  },

  messageButton: {
    backgroundColor: "#7380ef",
    padding: 12,
    borderRadius: 20,
    marginRight: 0,
    width: 250,
    alignItems: "center",
},
  logoutButton: {
      backgroundColor: "#FFB6C1",
      padding: 12,
      borderRadius: 20,
      width: 105,
      alignItems: "center",
  },
  buttonText: {
      fontWeight: "bold",
      color: "#333",
  },
  buttonText2: {
    fontWeight: "bold",
    color: "#fff",
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



      container: {
        flex: 1,
        backgroundColor: "#F8FAFB",
    },
    scrollContainer: {
        paddingBottom: 80,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#7a0f0f',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        fontSize:90,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#7a0f0f',
        borderRadius: 15,
        padding: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    editIconText: {
        fontSize: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10,
    },
    icon: {
        fontSize: 20,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginLeft: 5,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    passwordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
        
        flexWrap: 'nowrap',
        
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#a62626ff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        shadowColor: '#7a0f0f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    toggleButton: {
        padding: 5,
        marginLeft: 30,
    },
    toggleText: {
        fontSize: 20,
    },

    inputContainer: {
    marginBottom: 15,
},
inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
},
});
