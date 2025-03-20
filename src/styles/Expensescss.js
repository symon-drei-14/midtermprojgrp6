import { StyleSheet } from "react-native";

export const expensestyle = StyleSheet.create({
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
