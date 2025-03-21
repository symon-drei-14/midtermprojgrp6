import { StyleSheet } from "react-native";

export const expensestyle = StyleSheet.create({

  
  historyContainer: {
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
    width:320,
  },
  dropdownContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 1000,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  dropdownField: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#666',
  },
  dropdownList: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemSelected: {
    backgroundColor: '#f0f0f0',
  },
  dropdownItemTextSelected: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
container: {
    flex: 1,
    backgroundColor:"#e6ecec",
    padding: 20,
    justifyContent:"center",
    textAlign:"center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 30,
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
    backgroundColor: "#f7e2cf", 
    elevation: 20,
    marginTop:-20,
    
  },

  
  balanceTitle: {
    color: "#4c4a49",
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: "#4c4a49",
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
    backgroundColor: "#fff", 
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
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30, 
    right: 20, 
    elevation: 5, 
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
color: "#000000",
// fontWeight: "bold",
fontSize: 26,
},
buttonText4: {
  color: "#000000",
   fontWeight: "bold",

  },
});
