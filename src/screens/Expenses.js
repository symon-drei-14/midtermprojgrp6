import React, { useState, useCallback, useEffect } from "react";
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
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);

  // Enhanced tripId extraction with better debugging
  const tripId = route?.params?.tripId;
  
  // Debug logging function
  const debugLog = (section, data) => {
    console.log(`=== ${section.toUpperCase()} ===`);
    if (typeof data === 'object') {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(data);
    }
  };

  // Enhanced debugging on component mount
  useEffect(() => {
    debugLog('COMPONENT MOUNT DEBUG', {
      'Full route object': route,
      'Route params': route?.params,
      'Trip ID from params': tripId,
      'Trip ID type': typeof tripId,
      'Trip ID is valid': tripId && !isNaN(tripId)
    });
  }, []);

  const API_BASE_URL = 'http://192.168.100.17/capstone-1-eb';

  const quickAmounts = [100, 500, 1000, 5000];
  const expenseCategories = ["Gas", "Toll Gate", "Maintenance", "Food", "Parking", "Other"];

  useFocusEffect(
    useCallback(() => {
      debugLog('FOCUS EFFECT DEBUG', {
        'Screen focused': true,
        'Trip ID': tripId,
        'Trip ID type': typeof tripId,
        'Route params on focus': route?.params,
        'Has valid tripId': tripId && !isNaN(tripId)
      });
      
      setModalVisible(false);
      setDropdownVisible(false);
      initializeData();
    }, [tripId])
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
          debugLog('DRIVER INFO RETRIEVED', driver);
          setDriverInfo(driver);
          return driver;
        }
      }
      debugLog('DRIVER INFO ERROR', 'No valid session data found');
    } catch (error) {
      debugLog('DRIVER INFO ERROR', error.message);
    }
    return null;
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      debugLog('DATA INITIALIZATION START', {
        'Provided tripId': tripId,
        'Has tripId': !!tripId
      });
      
      const driver = await getDriverInfo();
      if (!driver) {
        debugLog('INITIALIZATION ERROR', 'No driver info found');
        setLoading(false);
        return;
      }

      // Enhanced tripId handling with validation
      if (tripId && !isNaN(tripId)) {
        debugLog('USING PROVIDED TRIP ID', {
          'tripId': tripId,
          'type': typeof tripId,
          'isValid': !isNaN(tripId)
        });
        await fetchExpensesByTripId(tripId);
      } else {
        debugLog('FETCHING CURRENT TRIP', 'No valid tripId provided');
        const trip = await fetchCurrentTrip(driver);
        if (trip) {
          debugLog('CURRENT TRIP FOUND', trip);
          await fetchExpensesByTripId(trip.trip_id);
        } else {
          debugLog('NO CURRENT TRIP', 'Setting empty state');
          setExpenses([]);
          setTotalExpenses(0);
          setTotalBudget(0);
          setRemainingBalance(0);
        }
      }
    } catch (error) {
      debugLog('INITIALIZATION ERROR', error.message);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentTrip = async (driver) => {
    try {
      debugLog('FETCHING CURRENT TRIP', {
        'driver_id': driver.driver_id,
        'driver_name': driver.name
      });
      
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
      debugLog('CURRENT TRIP RESPONSE', data);
      
      if (data.success && data.trip) {
        setCurrentTrip(data.trip);
        return data.trip;
      } else {
        debugLog('NO CURRENT TRIP', data.message || 'No trip found');
        setCurrentTrip(null);
        return null;
      }
    } catch (error) {
      debugLog('FETCH CURRENT TRIP ERROR', error.message);
      setCurrentTrip(null);
      return null;
    }
  };

  const fetchExpensesByTripId = async (targetTripId) => {
    try {
      debugLog('FETCH EXPENSES START', {
        'Target Trip ID': targetTripId,
        'Target Trip ID Type': typeof targetTripId,
        'API Base URL': API_BASE_URL,
        'Full API URL': `${API_BASE_URL}/include/handlers/expense_handler.php`
      });
      
      const requestBody = {
        action: 'get_expenses_by_trip',
        trip_id: targetTripId
      };
      debugLog('REQUEST BODY', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      debugLog('RESPONSE INFO', {
        'Status': response.status,
        'OK': response.ok,
        'Status Text': response.statusText
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      debugLog('RAW RESPONSE TEXT', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        debugLog('PARSED JSON RESPONSE', data);
      } catch (parseError) {
        debugLog('JSON PARSE ERROR', {
          'error': parseError.message,
          'raw_response': responseText
        });
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.success) {
        debugLog('SUCCESS - EXTRACTED VALUES', {
          'Total Budget (raw)': data.total_budget,
          'Total Budget (type)': typeof data.total_budget,
          'Total Expenses (raw)': data.total_expenses,
          'Total Expenses (type)': typeof data.total_expenses,
          'Remaining Balance (raw)': data.remaining_balance,
          'Remaining Balance (type)': typeof data.remaining_balance,
          'Expenses Array Length': data.expenses ? data.expenses.length : 'null/undefined'
        });
        
        const expensesList = data.expenses || [];
        const budget = parseFloat(data.total_budget) || 0;
        const expenses = parseFloat(data.total_expenses) || 0;
        const balance = parseFloat(data.remaining_balance) || 0;

        debugLog('AFTER PARSING', {
          'Parsed Budget': budget,
          'Parsed Expenses': expenses,
          'Parsed Balance': balance,
          'Expenses Count': expensesList.length
        });

        setExpenses(expensesList);
        setTotalBudget(budget);
        setTotalExpenses(expenses);
        setRemainingBalance(balance);

        debugLog('STATE SET COMPLETE', 'All state variables updated');
        
      } else {
        debugLog('API ERROR', {
          'success': false,
          'message': data.message,
          'full_response': data
        });
        
        setExpenses([]);
        setTotalBudget(0);
        setTotalExpenses(0);
        setRemainingBalance(0);
        
        Alert.alert('Error', data.message || 'Failed to load expenses data');
      }
    } catch (error) {
      debugLog('FETCH ERROR', {
        'error_type': error.constructor.name,
        'error_message': error.message,
        'error_stack': error.stack
      });
      
      setExpenses([]);
      setTotalBudget(0);
      setTotalExpenses(0);
      setRemainingBalance(0);
      
      Alert.alert('Error', 'Failed to load expenses. Please check your connection and try again.');
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
      setExpenseAmountError(`Expense cannot exceed remaining balance of ₱${formatCurrency(remainingBalance)}.`);
    } else if (parseFloat(text) <= 0) {
      setExpenseAmountError("Amount must be greater than 0.");
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
      setExpenseAmountError(`Expense cannot exceed remaining balance of ₱${formatCurrency(remainingBalance)}.`);
    } else if (parseFloat(expenseAmount) <= 0) {
      setExpenseAmountError("Amount must be greater than 0.");
    }
  };
  
  const addExpense = async () => {
    let hasError = false; 
    const expenseAmountNum = parseFloat(expenseAmount);
  
    if (expenseAmount.trim().length === 0) {
      setExpenseAmountError("Amount is required.");
      hasError = true; 
    } else if (isNaN(expenseAmountNum)) {
      setExpenseAmountError("Please enter a valid number.");
      hasError = true;
    } else if (expenseAmountNum <= 0) {
      setExpenseAmountError("Amount must be greater than 0.");
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

    // Enhanced trip ID determination with debugging
    const targetTripId = tripId || (currentTrip && currentTrip.trip_id);
    
    debugLog('ADD EXPENSE - TRIP ID DETERMINATION', {
      'provided_tripId': tripId,
      'currentTrip_id': currentTrip?.trip_id,
      'final_targetTripId': targetTripId,
      'has_valid_tripId': !!targetTripId
    });
    
    if (!targetTripId) {
      Alert.alert('Error', 'No active trip found');
      return;
    }

    try {
      setSubmitting(true);
      
      const expenseData = {
        trip_id: targetTripId,
        driver_id: driverInfo.driver_id,
        expense_type: showCustomInput ? customCategory : expenseName,
        amount: expenseAmountNum
      };
      
      debugLog('ADDING EXPENSE', expenseData);
      
      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add_expense',
          ...expenseData
        })
      });

      const data = await response.json();
      debugLog('ADD EXPENSE RESPONSE', data);
      
      if (data.success) {
        Alert.alert('Success', 'Expense added successfully');
        
        // Reset form
        setExpenseAmount("");
        setCustomCategory("");
        setShowCustomInput(false);
        setExpenseName("Gas");
        setExpenseAmountError("");
        setCustomCategoryError("");
        setModalVisible(false);
        
        // Refresh expenses list immediately
        await fetchExpensesByTripId(targetTripId);
      } else {
        Alert.alert('Error', data.message || 'Failed to add expense');
      }
    } catch (error) {
      debugLog('ADD EXPENSE ERROR', error.message);
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

  // Function to get budget status indicator
  const getBudgetStatus = () => {
    if (totalBudget === 0) return { color: '#666', text: 'No Budget Set' };
    
    const percentage = (totalExpenses / totalBudget) * 100;
    
    if (percentage >= 100) {
      return { color: '#ea5050', text: 'Over Budget' };
    } else if (percentage >= 80) {
      return { color: '#ff9500', text: 'Near Limit' };
    } else {
      return { color: '#58984d', text: 'Within Budget' };
    }
  };

  if (loading) {
    return (
      <View style={[expensestyle.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#58984d" />
        <Text style={{ marginTop: 10 }}>Loading expenses...</Text>
      </View>
    );
  }

  const budgetStatus = getBudgetStatus();

  return (
    <View style={expensestyle.container}>
      <View style={expensestyle.header}></View>

      <View style={expensestyle.balanceCard}>
        <Text style={expensestyle.balanceTitle}>Total Budget</Text>
        <Text style={expensestyle.balanceAmount}>₱ {formatCurrency(totalBudget)}</Text>
        
        <Text style={expensestyle.balanceTitle}>Total Expenses</Text>
        <Text style={[expensestyle.balanceAmount, {fontSize: 18, color: '#ea5050'}]}>
          ₱ {formatCurrency(totalExpenses)}
        </Text>
        
        <Text style={expensestyle.balanceTitle}>Remaining Balance</Text>
        <Text style={[expensestyle.balanceAmount, {color: remainingBalance >= 0 ? '#58984d' : '#ea5050'}]}>
          ₱ {formatCurrency(remainingBalance)}
        </Text>
        
        {/* Budget Status Indicator */}
        <View style={{
          backgroundColor: budgetStatus.color,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
          alignSelf: 'center',
          marginTop: 8
        }}>
          <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
            {budgetStatus.text}
          </Text>
        </View>
        
        {remainingBalance < 0 && (
          <Text style={{color: '#ea5050', fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginTop: 5}}>
            ⚠️ Over budget by ₱{formatCurrency(Math.abs(remainingBalance))}
          </Text>
        )}
        
        {totalBudget > 0 && (
          <Text style={{color: '#666', fontSize: 12, textAlign: 'center', marginTop: 5}}>
            {((totalExpenses / totalBudget) * 100).toFixed(1)}% of budget used
          </Text>
        )}
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
              
              {/* Show current balance info in modal */}
              <View style={{backgroundColor: '#f5f5f5', padding: 10, borderRadius: 5, marginBottom: 15}}>
                <Text style={{fontSize: 14, color: '#666', textAlign: 'center'}}>
                  Available Balance: ₱{formatCurrency(remainingBalance)}
                </Text>
                {totalBudget > 0 && (
                  <Text style={{fontSize: 12, color: '#666', textAlign: 'center', marginTop: 2}}>
                    Budget: ₱{formatCurrency(totalBudget)} | Used: {((totalExpenses / totalBudget) * 100).toFixed(1)}%
                  </Text>
                )}
              </View>
              
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
              {expenseAmountError ? <Text style={{color: 'red', fontSize: 12}}>{expenseAmountError}</Text> : null}

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
                  {customCategoryError ? <Text style={{color: 'red', fontSize: 12}}>{customCategoryError}</Text> : null}
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
                      backgroundColor: amount <= remainingBalance ? '#e8f5e8' : '#f0f0f0',
                      padding: 8,
                      margin: 4,
                      borderRadius: 5,
                      minWidth: 60,
                      alignItems: 'center',
                      opacity: amount <= remainingBalance ? 1 : 0.5
                    }}
                    onPress={() => {
                      if (amount <= remainingBalance) {
                        setExpenseAmount(amount.toString());
                        setExpenseAmountError("");
                      }
                    }}
                    disabled={amount > remainingBalance}
                  >
                    <Text style={{color: amount <= remainingBalance ? '#333' : '#999'}}>
                      ₱{amount}
                    </Text>
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