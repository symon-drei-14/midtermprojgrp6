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
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginstyle } from "../styles/Styles";
import { navbar } from "../styles/Navbar";
import { expensestyle } from "../styles/Expensescss";

import homeIcon from "../assets/Home2.png";
import userIcon from "../assets/trip2.png";
import locationIcon from "../assets/exp2.png";
import profileicon from "../assets/profile.png"

export default function Expenses({ navigation, route }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseName, setExpenseName] = useState("Gas");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseAmountError, setExpenseAmountError] = useState("");
  const [customCategoryError, setCustomCategoryError] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [driverInfo, setDriverInfo] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [cashAdvance, setCashAdvance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  const tripId = route?.params?.tripId;

  const API_BASE_URL = 'http://192.168.100.17/capstone-1-eb';

  const quickAmounts = [100, 500, 1000, 5000];
  const expenseCategories = ["Gas", "Toll Gate", "Maintenance", "Food", "Parking", "Other"];

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
      setDropdownVisible(false);
      initializeData();
    }, [])
  );

  const getDriverInfo = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session && session.userId && session.driverName) {
          const driver = {
            driver_id: session.userId,
            name: session.driverName,
          };
          setDriverInfo(driver);
          return driver;
        }
      }
    } catch (error) {
      console.error('Error getting driver info:', error);
    }
    return null;
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      const driver = await getDriverInfo();
      if (driver) {
        // First get current trip to get cash advance
        let tripCashAdvance = 0;
        if (tripId) {
          const trip = await fetchCurrentTrip(driver);
          tripCashAdvance = trip ? parseFloat(trip.cash_adv) || 0 : 0;
        }
        
        // Then fetch expenses and calculate balances
        await fetchExpenses(driver, tripCashAdvance);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentTrip = async (driver) => {
    try {
      const response = await fetch(`${API_BASE_URL}/include/handlers/trip_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_driver_current_trip',
          driver_id: driver.driver_id,
          driver_name: driver.name,
        })
      });

      const data = await response.json();
      if (data.success && data.trip) {
        setCurrentTrip(data.trip);
        const advance = parseFloat(data.trip.cash_adv) || 0;
        setCashAdvance(advance);
        return data.trip;
      }
    } catch (error) {
      console.error('Error fetching current trip:', error);
    }
    return null;
  };

  const fetchExpenses = async (driver, overrideCashAdvance = null) => {
    try {
      // Use current trip if available, otherwise use the tripId from params
      const useTrip = currentTrip || { trip_id: tripId };
      
      if (!useTrip || !useTrip.trip_id) {
        console.log('No trip ID available for fetching expenses');
        setExpenses([]);
        setTotalExpenses(0);
        setRemainingBalance(overrideCashAdvance || cashAdvance);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_expenses_by_trip',
          trip_id: useTrip.trip_id,
        })
      });

      const data = await response.json();
      if (data.success) {
        setExpenses(data.expenses || []);
        
        // Calculate total expenses from the returned data
        const expensesTotal = (data.expenses || []).reduce((total, expense) => {
          return total + (parseFloat(expense.amount) || 0);
        }, 0);
        setTotalExpenses(expensesTotal);
        
        // Use override cash advance if provided (from trip data)
        const advance = overrideCashAdvance !== null ? overrideCashAdvance : cashAdvance;
        
        const remaining = advance - expensesTotal;
        setRemainingBalance(remaining);
        
        console.log('Expense data:', {
          tripId: useTrip.trip_id,
          expenses: data.expenses?.length || 0,
          totalExpenses: expensesTotal,
          cashAdvance: advance,
          remainingBalance: remaining
        });
      } else {
        console.error('Error fetching expenses:', data.message);
        // Reset values on error
        setExpenses([]);
        setTotalExpenses(0);
        setRemainingBalance(overrideCashAdvance || cashAdvance);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      // Reset values on error
      setExpenses([]);
      setTotalExpenses(0);
      setRemainingBalance(overrideCashAdvance || cashAdvance);
    }
  };

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
    } else if (isNaN(parseFloat(text))) {
      setExpenseAmountError("Please enter a valid number.");
    } else if (parseFloat(text) > remainingBalance && remainingBalance > 0) {
      setExpenseAmountError("Expense cannot exceed remaining balance.");
    } else {
      setExpenseAmountError("");
    }
  };
  
  const handleBlurExpenseAmount = () => {
    if (expenseAmount.length === 0) {
      setExpenseAmountError("Amount is required.");
    } else if (isNaN(parseFloat(expenseAmount))) {
      setExpenseAmountError("Please enter a valid number.");
    } else if (parseFloat(expenseAmount) > remainingBalance && remainingBalance > 0) {
      setExpenseAmountError("Expense cannot exceed remaining balance.");
    }
  };
  
  const addExpense = async () => {
    let hasError = false; 
  
    if (expenseAmount.trim().length === 0) {
      setExpenseAmountError("Amount is required.");
      hasError = true; 
    } else if (isNaN(parseFloat(expenseAmount))) {
      setExpenseAmountError("Please enter a valid number.");
      hasError = true;
    } else if (parseFloat(expenseAmount) > remainingBalance && remainingBalance > 0) {  
      setExpenseAmountError("Expense cannot exceed remaining balance.");
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

    if (!driverInfo) {
      Alert.alert('Error', 'Driver information not found');
      return;
    }

    // Use current trip if available, otherwise use the tripId from params
    const useTrip = currentTrip || { trip_id: tripId };
    
    if (!useTrip || !useTrip.trip_id) {
      Alert.alert('Error', 'No active trip found');
      return;
    }

    try {
      setSubmitting(true);
      
      console.log('Adding expense:', {
        trip_id: useTrip.trip_id,
        driver_id: driverInfo.driver_id,
        expense_type: showCustomInput ? customCategory : expenseName,
        amount: parseFloat(expenseAmount)
      });
      
      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add_expense',
          trip_id: useTrip.trip_id,
          driver_id: driverInfo.driver_id,
          expense_type: showCustomInput ? customCategory : expenseName,
          amount: parseFloat(expenseAmount),
        })
      });

      const data = await response.json();
      
      console.log('Add expense response:', data);
      
      if (data.success) {
        Alert.alert('Success', 'Expense added successfully');
        
        // Reset form
        setExpenseAmount("");
        setCustomCategory("");
        setShowCustomInput(false);
        setExpenseName("Gas");
        setModalVisible(false);
        
        // Refresh expenses list - preserve current cash advance
        await fetchExpenses(driverInfo, cashAdvance);
      } else {
        Alert.alert('Error', data.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeDropdown = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <View style={[expensestyle.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#58984d" />
        <Text style={{ marginTop: 10 }}>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <View style={expensestyle.container}>
      <View style={expensestyle.header}></View>

      <View style={expensestyle.balanceCard}>
        <Text style={expensestyle.balanceTitle}>Cash Advance</Text>
        <Text style={expensestyle.balanceAmount}>₱ {formatCurrency(cashAdvance)}</Text>
        <Text style={expensestyle.balanceTitle}>Total Expenses</Text>
        <Text style={[expensestyle.balanceAmount, {fontSize: 18, color: '#ea5050'}]}>₱ {formatCurrency(totalExpenses)}</Text>
        <Text style={expensestyle.balanceTitle}>Remaining Balance</Text>
        <Text style={[expensestyle.balanceAmount, {color: remainingBalance >= 0 ? '#58984d' : '#ea5050'}]}>
          ₱ {formatCurrency(remainingBalance)}
        </Text>
      </View>

      <Text style={expensestyle.sectionTitle}>Expense History</Text>
      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.expense_id.toString()}
          renderItem={({ item }) => (
            <View style={expensestyle.expenseItem}>
              <View style={expensestyle.expenseDetails}>
                <Text style={expensestyle.expenseText}>{item.expense_type}</Text>
                <Text style={expensestyle.expenseDate}>{item.formatted_date}</Text>
                {item.destination && (
                  <Text style={[expensestyle.expenseDate, {fontSize: 12, color: '#666'}]}>
                    Trip: {item.destination}
                  </Text>
                )}
              </View>
              <Text style={expensestyle.expenseAmount}>₱ {formatCurrency(item.amount)}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={true}
        />
      ) : (
        <View style={expensestyle.expenseItem}>
          <Text style={expensestyle.expenseText}>No expenses recorded yet</Text>
        </View>
      )}

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
              
              {/* Dropdown for expense categories */}
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
              
              {/* Quick amount buttons */}
              <Text style={expensestyle.dropdownLabel}>Quick Amounts</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20}}>
                {quickAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={{
                      backgroundColor: '#f0f0f0',
                      padding: 8,
                      margin: 4,
                      borderRadius: 5,
                      minWidth: 60,
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      setExpenseAmount(amount.toString());
                      setExpenseAmountError("");
                    }}
                  >
                    <Text style={{color: '#333'}}>₱{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button 
                title={submitting ? "Submitting..." : "Submit"} 
                color="#58984d" 
                onPress={addExpense} 
                disabled={submitting}
              />
              <View style={{ height: 10 }} />
              <Button 
                title="Cancel" 
                color="#ea5050" 
                onPress={() => {
                  setModalVisible(false);
                  setExpenseAmount("");
                  setCustomCategory("");
                  setShowCustomInput(false);
                  setExpenseName("Gas");
                  setExpenseAmountError("");
                  setCustomCategoryError("");
                }} 
                disabled={submitting}
              />
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
  );
}