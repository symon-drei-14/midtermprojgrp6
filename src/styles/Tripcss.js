
import { StyleSheet } from "react-native";

export const tripstyle = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      padding: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    tripContainer: {
      width: '100%',
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    tripDetails: {
      flexDirection: 'column',
      marginBottom: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    value: {
      fontSize: 16,
      color: '#333',
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalButton: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
      marginVertical: 5,
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    cancelButton: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });