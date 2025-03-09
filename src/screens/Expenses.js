import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Modal, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";


export default function Expenses({ navigation }) {
  const [expenses, setExpenses] = useState([
    { id: "1", name: "Toll gate", amount: 500, date: "01.20.25" },
    { id: "2", name: "Gas", amount: 200000, date: "01.20.25"},
    { id: "3", name: "Food", amount: 6000, date: "01.20.25" },
    { id: "4", name: "Talyer", amount: 4111, date: "01.20.25" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseName, setExpenseName] = useState("Gas");
  const [expenseAmount, setExpenseAmount] = useState("");
  const budget = 87430.12;
 useFocusEffect(
    useCallback(() => {
      setModalVisible(false); // Reset modal when Trips screen is focused
    }, [])
  );

  const quickAmounts = [100, 500, 1000, 5000];
  const expenseCategories = ["Gas", "Food", "Toll Gate", "Maintenance"];


  const addExpense = () => {
    if (expenseAmount) {
      setExpenses([...expenses, { id: Math.random().toString(), name: expenseName, amount: parseFloat(expenseAmount) }]);
      setExpenseAmount("");
      setModalVisible(false);
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.placeholderCircle} />
        <Text style={styles.greeting}>Hello Driver</Text>
        <View style={styles.placeholderSquare} />
      </View>


      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balanceAmount}>₱ {budget}</Text>
      </View>


      {/* Holdings List */}
      <Text style={styles.sectionTitle}>Expense History</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View style={styles.placeholderSquare} />
            <Text style={styles.expenseText}>{item.name}</Text>
                  <Text style={styles.expenseText}>{item.date}</Text>
            <Text style={styles.expenseAmount}>₱ {item.amount}</Text>
          </View>
        )}
      />


      {/* Report Expense Button */}
      <TouchableOpacity style={styles.expensebutton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText2}>Report Expense</Text>
      </TouchableOpacity>


      {/* Modal for Reporting Expense */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Report Expense</Text>
           
         
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={expenseAmount}
              onChangeText={setExpenseAmount}
            />


            <View style={styles.quickAmountContainer}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity key={amount} style={styles.quickAmountButton} onPress={() => setExpenseAmount(amount.toString())}>
                  <Text style={styles.buttonText}>₱{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
               <View style={{ height: 20 }} />
               <View style={styles.categoryContainer}>
              {expenseCategories.map((category) => (
                <TouchableOpacity key={category} style={styles.categoryButton} onPress={() => setExpenseName(category)}>
                  <Text style={styles.buttonText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>




            <Button title="Submit" onPress={addExpense} />
              <View style={{ height: 10 }} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20, marginTop:30 },
  placeholderCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#444" },
  placeholderSquare: { 
width: 24, 
height: 24, 
backgroundColor: "#444" 
},
  greeting: { 
color: "white", 
fontSize: 20, 
fontWeight: "bold" 
},
  balanceCard: { 
padding: 20, 
borderRadius: 15, 
marginBottom: 20, 
backgroundColor: "#ff9a9e" 
},
  balanceTitle: { 
color: "#000", 
fontSize: 16, 
marginBottom: 5 
},
  balanceAmount: { 
color: "#000", 
fontSize: 28, 
fontWeight: "bold" 
},
  buttonText2: {color:"white"},
  sectionTitle: { 
color: "white", 
fontSize: 18, 
fontWeight: "bold", 
marginBottom: 10 
},
  expenseItem: { 
flexDirection: "row", 
alignItems: "center", 
justifyContent: "space-between", 
padding: 15, 
backgroundColor: "#222", 
borderRadius: 10, 
marginBottom: 10 
},
  
expenseText: { 
color: "white", 
fontSize: 16 
},
  expenseAmount: { 
color: "white", 
fontSize: 16, 
fontWeight: "bold" 
},
  expensebutton: { 
backgroundColor: "#6200ee", 
padding: 15, 
borderRadius: 10, 
alignItems: "center", 
marginTop: 20 
},
  modalContainer: { 
flex: 1, 
justifyContent: "center",
 alignItems: "center", 
backgroundColor: "rgba(0, 0, 0, 0.5)" 
},
  modalContent: { 
width: "80%", 
padding: 20, 
backgroundColor: "#fff", 
borderRadius: 10 
},
  input: { 
borderBottomWidth: 1, 
marginBottom: 10, 
fontSize: 16 
},
  quickAmountContainer: { 
flexDirection: "row", 
justifyContent: "space-around", 
marginBottom: 10 
},
  quickAmountButton: { 
backgroundColor: "white", 
padding: 5, 
borderRadius: 5, 
borderColor: "#7e9df1",
 borderWidth: 2  
},
  categoryContainer: { 
flexDirection: "row", 
justifyContent: "space-around", 
marginBottom: 10  
},
  categoryButton: { 
borderColor: "#0f8b5d", 
padding: 10, 
borderRadius: 5, 
overflow:"break", 
fontSize:14, 
backgroundColor:"white", 
borderWidth:2 }
});
