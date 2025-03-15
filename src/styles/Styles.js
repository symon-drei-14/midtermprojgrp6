import { StyleSheet } from "react-native";
import { red100 } from "../../node_modules/react-native-paper/lib/typescript/styles/themes/v2/colors";



export const loginstyle = StyleSheet.create({
  usernameError:{


  },


  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },

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

  logoutButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  expense: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5", 
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      marginTop: 30,
    },
    placeholderCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#007AFF", 
    },
    placeholderSquare: {
      width: 24,
      height: 24,
      backgroundColor: "#007AFF", 
    },
    greeting: {
      color: "#333",
      fontSize: 20,
      fontWeight: "bold",
    },
    balanceCard: {
      padding: 20,
      borderRadius: 15,
      marginBottom: 20,
      backgroundColor: "#4CAF50", 
      elevation: 5,
    },
    balanceTitle: {
      color: "#FFF",
      fontSize: 16,
      marginBottom: 5,
    },
    balanceAmount: {
      color: "#FFF",
      fontSize: 28,
      fontWeight: "bold",
    },
    buttonText2: {
      color: "#FFF",
      fontWeight: "bold",
    },
    sectionTitle: {
      color: "#333",
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    expenseItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      backgroundColor: "#FFF", 
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    expenseText: {
      color: "#333",
      fontSize: 16,
    },
    expenseAmount: {
      color: "#E53935", 
      fontSize: 16,
      fontWeight: "bold",
    },
    expensebutton: {
      backgroundColor: "#007AFF", 
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", 
    },
    modalContent: {
      width: "80%",
      padding: 20,
      backgroundColor: "#FFF",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: "#007AFF",
      marginBottom: 10,
      fontSize: 16,
      color: "#333",
    },
    quickAmountContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
    },
    quickAmountButton: {
      backgroundColor: "#007AFF",
      padding: 5,
      borderRadius: 5,
      borderColor: "#007AFF",
      borderWidth: 2,
    },
    categoryContainer: {
      flexDirection: "row",
      // justifyContent: "space-around",
      flexWrap: "wrap", 
  gap: 8, 
      marginBottom: 10,
    },
    categoryButton: {
      borderColor: "#007AFF",
      padding: 10,
      borderRadius: 5,
      fontSize: 14,
      backgroundColor: "white",
      borderWidth: 2,
    },
    sectionTitle: { color: "#000", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
buttonText2: { color: "#000" }, 
buttonText3: {
  color: "#FFF",
  fontWeight: "bold",
},
  }),

  trip: StyleSheet.create({
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
  }),










});

