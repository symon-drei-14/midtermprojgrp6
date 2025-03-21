import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Modal, 
  TextInput, 
  Button, 
  TouchableOpacity, 
  Image,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
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
  ]);
  const nav = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseName, setExpenseName] = useState("Gas");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseAmountError, setExpenseAmountError] = useState("");
  const [customCategoryError, setCustomCategoryError] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const budget = 87430.12;

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
      setDropdownVisible(false);
    }, [])
  );

  const quickAmounts = [100, 500, 1000, 5000];

  const expenseCategories = ["Gas", "Toll Gate", "Maintenance", "Other"];

  const handleCategorySelect = (category) => {
    setExpenseName(category);
    
    if (category === "Other") {
      setShowCustomInput(true);
      setCustomCategory("");
      setCustomCategoryError(""); 
    } else {
      setShowCustomInput(false);
      setCustomCategoryError(""); 
    }
    setDropdownVisible(false);
  };

  const validateCustomCategory = (text) => {
    setCustomCategory(text);
    if (text.length === 0) {
      setCustomCategoryError("Category is required.");
    } else {
      setCustomCategoryError("");
    }
  };

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


  const closeDropdown = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={closeDropdown}>
      <View style={expensestyle.container}>
        <View style={expensestyle.header}></View>

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
              <View style={expensestyle.expenseDetails}>
                <Text style={expensestyle.expenseText}>{item.name}</Text>
                <Text style={expensestyle.expenseDate}>{item.date}</Text>
              </View>
              <Text style={expensestyle.expenseAmount}>₱ {item.amount.toLocaleString()}</Text>
            </View>
          )}
        />

{/* <View style={[expensestyle.historyContainer, { height: 380, width:500 }]}>
  <FlatList
    data={expenses}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={expensestyle.expenseItem}>
        <View style={expensestyle.expenseDetails}>
          <Text style={expensestyle.expenseText}>{item.name}</Text>
          <Text style={expensestyle.expenseDate}>{item.date}</Text>
        </View>
        <Text style={expensestyle.expenseAmount}>₱ {item.amount.toLocaleString()}</Text>
      </View>
    )}
    showsVerticalScrollIndicator={true}
  />
</View> */}

        <TouchableOpacity 
          style={[expensestyle.expensebutton, { marginBottom: 100 }]} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={expensestyle.buttonText3}>+</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <TouchableWithoutFeedback onPress={closeDropdown}>
            <View style={expensestyle.modalContainer}>
              <View style={expensestyle.modalContent}>
                <Text style={expensestyle.sectionTitle}>Report Expense</Text>
                
                <TextInput
                  style={[
                    expensestyle.input,
                    expenseAmountError ? {borderColor: 'red'} : null
                  ]}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  value={expenseAmount}
                  onChangeText={validateExpenseAmount}
                  onBlur={handleBlurExpenseAmount}
                />
                {expenseAmountError ? <Text style={{color: 'red'}}>{expenseAmountError}</Text> : null}

              

                <View style={{ height: 20 }} />
                
                <Text style={expensestyle.dropdownLabel}>Expense Category</Text>
                
      {/* marker ng dropdown */}
                <View style={expensestyle.dropdownContainer}>
  <TouchableOpacity 
    style={[
      expensestyle.dropdownField,
      dropdownVisible ? {borderBottomLeftRadius: 0, borderBottomRightRadius: 0} : null
    ]} 
    onPress={() => setDropdownVisible(!dropdownVisible)}
  >
    <Text style={[
      expensestyle.dropdownText, 
      expenseName === "" ? {color: '#999'} : {color: '#333'}
    ]}>
      {expenseName || "Select Category"}
    </Text>
    <Text style={expensestyle.dropdownArrow}>{dropdownVisible ? '▲' : '▼'}</Text>
  </TouchableOpacity>
  
  {dropdownVisible && (
    <View style={expensestyle.dropdownList}>
      <ScrollView 
        nestedScrollEnabled={true} 
        style={{maxHeight: 200}}
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
      >
        {expenseCategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              expensestyle.dropdownItem,
              expenseName === category ? expensestyle.dropdownItemSelected : null
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text style={[
              expensestyle.dropdownItemText,
              expenseName === category ? expensestyle.dropdownItemTextSelected : null
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )}
</View>

                {showCustomInput && (
                  <View style={{marginTop: 15}}>
                    <TextInput
                      style={[
                        expensestyle.input,
                        customCategoryError ? {borderColor: 'red'} : null
                      ]}
                      placeholder="Enter Custom Category"
                      value={customCategory}
                      onChangeText={validateCustomCategory}
                      onBlur={handleBlurCustomCategory}
                    />
                    {customCategoryError ? <Text style={{color: 'red'}}>{customCategoryError}</Text> : null}
                  </View>
                )}

                <View style={{ height: 20 }} />
                <Button title="Submit" onPress={addExpense} />
                <View style={{ height: 10 }} />
                <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={navbar.bottomNav2}>
          <TouchableOpacity onPress={() => nav.navigate("Dashboard")}>
            <Image source={homeIcon} style={navbar.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate("Trips")}>
            <Image source={userIcon} style={navbar.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate("Profile")}>
            <Image source={profileicon} style={navbar.navIcon} />
          </TouchableOpacity>
        </View>
      </View>
    // </TouchableWithoutFeedback>
  );
}