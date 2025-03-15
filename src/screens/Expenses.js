import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Modal, TextInput, Button, TouchableOpacity, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { expensestyle } from "../styles/Expensescss";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import locationIcon from "../assets/exp2.png";
import profileicon from "../assets/profile.png"

export default function Expenses({ navigation }) {
  const [expenses, setExpenses] = useState([
    { id: "1", name: "Toll gate", amount: 500, date: "01/20/25" },
    { id: "2", name: "Gas", amount: 200000, date: "01/20/25" },
    { id: "3", name: "Food", amount: 6000, date: "01/20/25" },
    { id: "4", name: "Talyer", amount: 4111, date: "01/20/25" },
  ]);
  const nav = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseName, setExpenseName] = useState("Gas");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseAmountError, setExpenseAmountError] = useState("");
  const [customCategoryError, setCustomCategoryError] = useState("");
  const budget = 87430.12;

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
    }, [])
  );

  const quickAmounts = [100, 500, 1000, 5000];
  const expenseCategories = ["Gas", "Food", "Toll Gate", "Maintenance"];

  // const handleCategorySelect = (category) => {
  //   if (category === "Other") {
  //     setShowCustomInput(true);
  //     setExpenseName(""); 
  //   } else {
  //     setShowCustomInput(false);
  //     setExpenseName(category);
  //   }
  // };

  const handleCategorySelect = (category) => {
    if (category === "Other") {
      setShowCustomInput(true);
      setExpenseName("");
      setCustomCategory("");
      setCustomCategoryError(""); 
    } else {
      setShowCustomInput(false);
      setExpenseName(category);
      setCustomCategoryError(""); 
    }
  };

  const validateCustomCategory = (text) => {
    setCustomCategory(text);
    if (text.length === 0) {
      setCustomCategoryError("Category is required.");
    } else {
      setCustomCategoryError("");
    }
  };

  // if (showCustomInput && customCategory.length === 0) {
  //   setCustomCategoryError("Category is required.");
  //   return;
  // }

  const handleBlurCustomCategory = () => {
    if (customCategory.length === 0) {
      setCustomCategoryError("Category is required.");
    }
  };
  


  const validateExpenseAmount = (text) => {
    setExpenseAmount(text);
    if (text.length === 0) {
      setExpenseAmountError("Amount is required.");
    } else {
      setExpenseAmountError("");
    }
  };
  
  const handleBlurExpenseAmount = () => {
    if (expenseAmount.length === 0) {
      setExpenseAmountError("Amount is required.");
    }
  };
  
  const addExpense = () => {
    let hasError = false; 
  

    if (expenseAmount.trim().length === 0) {
      setExpenseAmountError("Amount is required.");
      hasError = true; 
    } else {
      setExpenseAmountError(""); 
    }
  
 
    if (showCustomInput && customCategory.trim().length === 0) {
      setCustomCategoryError("Category is required.");
      hasError = true; 
    } else {
      setCustomCategoryError(""); 
    }
 
    if (hasError) {
      return;
    }
  
    const newExpense = {
      id: Math.random().toString(),
      name: showCustomInput ? customCategory : expenseName,
      amount: parseFloat(expenseAmount),
      date: new Date().toLocaleDateString("en-US"),
    };
  
    setExpenses([...expenses, newExpense]);
    setExpenseAmount("");
    setCustomCategory("");
    setShowCustomInput(false);
    setModalVisible(false);
  
  };

  return (
    <View style={expensestyle.container}>
      <View style={expensestyle.header}>
        <View style={expensestyle.placeholderCircle} />
        <Text style={expensestyle.greeting}>Hello Driver</Text>
        <View style={expensestyle.placeholderSquare} />

        
      </View>

      <View style={expensestyle.balanceCard}>
        <Text style={expensestyle.balanceTitle}>Current Balance</Text>
        <Text style={expensestyle.balanceAmount}>₱ {budget}</Text>
      </View>

      <Text style={expensestyle.sectionTitle}>Expense History</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={expensestyle.expenseItem}>
            <View style={expensestyle.placeholderSquare} />
            <Text style={expensestyle.expenseText}>{item.name}</Text>
            <Text style={expensestyle.expenseText}>{item.date}</Text>
            <Text style={expensestyle.expenseAmount}>₱ {item.amount}</Text>
          </View>
          
        )}
      />

      <TouchableOpacity style={[expensestyle.expensebutton, { marginBottom: 100 }]} onPress={() => setModalVisible(true)}>
        <Text style={expensestyle.buttonText3}>Report Expense</Text>
      </TouchableOpacity>

     

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={expensestyle.modalContainer}>
          <View style={expensestyle.modalContent}>
            <Text style={expensestyle.sectionTitle}>Report Expense</Text>
            <TextInput
  style={[
    expensestyle.input,
    expenseAmountError ? expensestyleError :null
  ]}
  placeholder="Enter Amount"
  keyboardType="numeric"
  value={expenseAmount}
  onChangeText={validateExpenseAmount}
  onBlur={handleBlurExpenseAmount}
/>
{expenseAmountError ? <Text style={ errorTestylexpensestylext}>{expenseAmountError}</Text> : null}

            <View style={expensestyle.quickAmountContainer}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity key={amount} style={expensestyle.quickAmountButton} onPress={() => setExpenseAmount(amount.toString())}>
                  <Text style={expensestyle.buttonText3}>₱{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 20 }} />
            <View style={expensestyle.categoryContainer}>
              {expenseCategories.map((category) => (
                <TouchableOpacity key={category} style={expensestyle.categoryButton} onPress={() => handleCategorySelect(category)}>
                  <Text style={expensestyle.buttonText2}>{category}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={expensestyle.categoryButton} onPress={() => handleCategorySelect("Other")}>
                <Text style={expensestyle.buttonText2}>Other</Text>
              </TouchableOpacity>
            </View>

            {showCustomInput && (
  <>
    <TextInput
      style={[
        expensestyle.input,
        customCategoryError ? categorstylexpensestyleyError :null
      ]}
      placeholder="Enter Custom Category"
      value={customCategory}
      onChangeText={validateCustomCategory}
      onBlur={handleBlurCustomCategory}
    />
    {customCategoryError ? <Text style={ errorTestylexpensestylext}>{customCategoryError}</Text> : null}
  </>
)}

            <Button title="Submit" onPress={addExpense} />
            <View style={{ height: 10 }} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <View style={navbar.bottomNav}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
          <Image source={homeIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Trips")}>
          <Image source={userIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Expenses")}>
          <Image source={locationIcon} style={navbar.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Profile")}>
          <Image source={profileicon} style={navbar.navIcon} />
        </TouchableOpacity>
        </View>
     
    </View>

   

    

    
  );
  
}