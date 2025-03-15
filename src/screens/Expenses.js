import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Modal, TextInput, Button, TouchableOpacity, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { loginstyle } from "../styles/Styles";

import homeIcon from "../assets/home.jpg";
import userIcon from "../assets/exp.jpg";
import locationIcon from "../assets/trip.jpg";

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
    <View style={loginstyle.expense.container}>
      <View style={loginstyle.expense.header}>
        <View style={loginstyle.expense.placeholderCircle} />
        <Text style={loginstyle.expense.greeting}>Hello Driver</Text>
        <View style={loginstyle.expense.placeholderSquare} />
      </View>

      <View style={loginstyle.expense.balanceCard}>
        <Text style={loginstyle.expense.balanceTitle}>Current Balance</Text>
        <Text style={loginstyle.expense.balanceAmount}>₱ {budget}</Text>
      </View>

      <Text style={loginstyle.expense.sectionTitle}>Expense History</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={loginstyle.expense.expenseItem}>
            <View style={loginstyle.expense.placeholderSquare} />
            <Text style={loginstyle.expense.expenseText}>{item.name}</Text>
            <Text style={loginstyle.expense.expenseText}>{item.date}</Text>
            <Text style={loginstyle.expense.expenseAmount}>₱ {item.amount}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={[loginstyle.expense.expensebutton, { marginBottom: 60 }]} onPress={() => setModalVisible(true)}>
        <Text style={loginstyle.expense.buttonText3}>Report Expense</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={loginstyle.expense.modalContainer}>
          <View style={loginstyle.expense.modalContent}>
            <Text style={loginstyle.expense.sectionTitle}>Report Expense</Text>
            <TextInput
  style={[
    loginstyle.expense.input,
    expenseAmountError ? loginstyle.expenseError :null
  ]}
  placeholder="Enter Amount"
  keyboardType="numeric"
  value={expenseAmount}
  onChangeText={validateExpenseAmount}
  onBlur={handleBlurExpenseAmount}
/>
{expenseAmountError ? <Text style={ loginstyle.errorText}>{expenseAmountError}</Text> : null}

            <View style={loginstyle.expense.quickAmountContainer}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity key={amount} style={loginstyle.expense.quickAmountButton} onPress={() => setExpenseAmount(amount.toString())}>
                  <Text style={loginstyle.expense.buttonText3}>₱{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 20 }} />
            <View style={loginstyle.expense.categoryContainer}>
              {expenseCategories.map((category) => (
                <TouchableOpacity key={category} style={loginstyle.expense.categoryButton} onPress={() => handleCategorySelect(category)}>
                  <Text style={loginstyle.expense.buttonText2}>{category}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={loginstyle.expense.categoryButton} onPress={() => handleCategorySelect("Other")}>
                <Text style={loginstyle.expense.buttonText2}>Other</Text>
              </TouchableOpacity>
            </View>

            {showCustomInput && (
  <>
    <TextInput
      style={[
        loginstyle.expense.input,
        customCategoryError ? loginstyle.categoryError :null
      ]}
      placeholder="Enter Custom Category"
      value={customCategory}
      onChangeText={validateCustomCategory}
      onBlur={handleBlurCustomCategory}
    />
    {customCategoryError ? <Text style={ loginstyle.errorText}>{customCategoryError}</Text> : null}
  </>
)}

            <Button title="Submit" onPress={addExpense} />
            <View style={{ height: 10 }} />
            <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <View style={loginstyle.bottomNav}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
          <Image source={homeIcon} style={loginstyle.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Trips")}>
          <Image source={userIcon} style={loginstyle.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("Expenses")}>
          <Image source={locationIcon} style={loginstyle.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}