import { StyleSheet } from "react-native";



export const loginstyle = StyleSheet.create({

  background: {
    flex: 1, 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover', 
  },
  expenseError:{
    borderColor: "red", 
    borderWidth: 1,

  },

  splashImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  categoryError:{
    borderColor: "red",
     borderWidth: 1,
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
    top:200,
  },
  innerContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    
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
    borderColor: "#125f0f",
    borderRadius: 100,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    fontSize:14,
    color:"black",
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

 






});

