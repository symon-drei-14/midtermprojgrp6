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
import { navbar } from "../styles/Navbar";
import { expensestyle } from "../styles/Expensescss";
import { useNavigationState } from "@react-navigation/native";
import homeIcon from "../assets/Home.png";
import userIcon from "../assets/schedule.png";
import profileicon from "../assets/profile2.png";

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
  const state = useNavigationState((state) => state);
  const currentRoute = state.routes[state.index].name;
  const tripId = route?.params?.tripId;

  const handleOpenModal = () => {
    setModalVisible(true);
  };

   const API_BASE_URL = 'http://192.168.100.17/capstone-1-eb';
  //const API_BASE_URL = 'http://192.168.1.6/capstone-1-eb';

  const quickAmounts = [100, 500, 1000, 5000];
  const expenseCategories = ["Gas", "Toll Gate", "Maintenance", "Food", "Parking", "Other"];

  useFocusEffect(
    useCallback(() => {
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
          
          setDriverInfo(driver);
          return driver;
        }
      }
    } catch (error) {
      console.error('Driver info error:', error.message);
    }
    return null;
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      
      const driver = await getDriverInfo();
      if (!driver) {
        setLoading(false);
        return;
      }

      if (tripId && !isNaN(tripId)) {
        await fetchExpensesByTripId(tripId);
      } else {
        const trip = await fetchCurrentTrip(driver);
        if (trip) {
          await fetchExpensesByTripId(trip.trip_id);
        } else {
          setExpenses([]);
          setTotalExpenses(0);
          setTotalBudget(0);
          setRemainingBalance(0);
        }
      }
    } catch (error) {
      console.error('Initialization error:', error.message);
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
        return data.trip;
      } else {
        setCurrentTrip(null);
        return null;
      }
    } catch (error) {
      console.error('Fetch current trip error:', error.message);
      setCurrentTrip(null);
      return null;
    }
  };

  const fetchExpensesByTripId = async (targetTripId) => {
    try {
      const requestBody = {
        action: 'get_expenses_by_trip',
        trip_id: targetTripId
      };
      
      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.success) {
        const expensesList = data.expenses || [];
        const budget = parseFloat(data.total_budget) || 0;
        const expenses = parseFloat(data.total_expenses) || 0;
        const balance = parseFloat(data.remaining_balance) || 0;

        setExpenses(expensesList);
        setTotalBudget(budget);
        setTotalExpenses(expenses);
        setRemainingBalance(balance);
        
      } else {
        setExpenses([]);
        setTotalBudget(0);
        setTotalExpenses(0);
        setRemainingBalance(0);
        
        Alert.alert('Error', data.message || 'Failed to load expenses data');
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      
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

    let targetTripId = null;
    let targetTruckId = null;
    
    if (tripId && !isNaN(parseInt(tripId)) && parseInt(tripId) > 0) {
      targetTripId = parseInt(tripId);
    } else if (currentTrip && currentTrip.trip_id && !isNaN(parseInt(currentTrip.trip_id)) && parseInt(currentTrip.trip_id) > 0) {
      targetTripId = parseInt(currentTrip.trip_id);
    }
    
    if (currentTrip && currentTrip.truck_id && !isNaN(parseInt(currentTrip.truck_id)) && parseInt(currentTrip.truck_id) > 0) {
      targetTruckId = parseInt(currentTrip.truck_id);
    }
    
    if (!targetTripId || targetTripId <= 0) {
      Alert.alert('Error', 'No valid active trip found. Please ensure you have an active trip.');
      return;
    }

    try {
      setSubmitting(true);
      
      const expenseData = {
        action: 'add_expense',
        trip_id: targetTripId,
        driver_id: parseInt(driverInfo.driver_id),
        expense_type: showCustomInput ? customCategory.trim() : expenseName,
        amount: expenseAmountNum
      };
      
      if (targetTruckId && targetTruckId > 0) {
        expenseData.truck_id = targetTruckId;
      }
      
      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }
      
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
        
        // Refresh expenses list
        await fetchExpensesByTripId(targetTripId);
      } else {
        Alert.alert('Error', data.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Add expense error:', error.message);
      Alert.alert('Error', 'Failed to add expense. Please check your connection and try again.');
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
    <View style={expensestyle.contentContainer}>
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
        
        {remainingBalance < 0 && (
          <Text style={{color: '#ea5050', fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginTop: 5}}>
            ⚠️ Over budget by ₱{formatCurrency(Math.abs(remainingBalance))}
          </Text>
        )}
      </View>

      <Text style={expensestyle.sectionTitle}>Expense History</Text>
      
      {/* Fixed expense list container */}
      <View style={expensestyle.expenseListContainer}>
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
            contentContainerStyle={{paddingBottom: 20}}
          />
        ) : (
          <View style={expensestyle.expenseItem}>
            <Text style={expensestyle.expenseText}>No expenses recorded yet</Text>
          </View>
        )}
      </View>

      {/* Fixed floating action button position */}
      <TouchableOpacity 
        style={expensestyle.expensebutton} 
        onPress={handleOpenModal}
      >
        <Text style={expensestyle.buttonText3}>+</Text>
      </TouchableOpacity>
    </View>

    {/* Modal remains the same */}
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={closeDropdown}>
        <View style={expensestyle.modalContainer}>
          <View style={expensestyle.modalContent}>
            <Text style={expensestyle.sectionTitle}>Report Expense</Text>
            
            <View style={{backgroundColor: '#f5f5f5', padding: 10, borderRadius: 5, marginBottom: 15}}>
              <Text style={{fontSize: 14, color: '#666', textAlign: 'center'}}>
                Available Balance: ₱{formatCurrency(remainingBalance)}
              </Text>
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

    {/* Bottom Navigation - positioned absolutely to extend full width */}
    <View style={navbar.bottomNav}>
      <TouchableOpacity style={navbar.navButton} onPress={() => nav.navigate("Dashboard")}>
        {currentRoute === "Dashboard" && <View style={navbar.activeIndicator} />}
        <Image source={homeIcon} style={navbar.navIcon} />
        <Text style={currentRoute === "Dashboard" ? navbar.activeNavLabel : navbar.navLabel}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={navbar.navButton} onPress={() => nav.navigate("Trips")}>
        {(currentRoute === "Trips" || currentRoute === "Expenses") && <View style={navbar.activeIndicator} />}
        <Image source={userIcon} style={navbar.navIcon} />
        <Text style={(currentRoute === "Trips" || currentRoute === "Expenses") ? navbar.activeNavLabel : navbar.navLabel}>
          Trips
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={navbar.navButton} onPress={() => nav.navigate("Profile")}>
        {currentRoute === "Profile" && <View style={navbar.activeIndicator} />}
        <Image source={profileicon} style={navbar.navIcon} />
        <Text style={currentRoute === "Profile" ? navbar.activeNavLabel : navbar.navLabel}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
}