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
  Alert,
  StatusBar,
  Animated
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
  const [loadingExpenseTypes, setLoadingExpenseTypes] = useState(false);
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
  const [isEnRoute, setIsEnRoute] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState(["Gas", "Toll Gate", "Maintenance", "Food", "Parking", "Other"]);
  const [refreshing, setRefreshing] = useState(false);
  const state = useNavigationState((state) => state);
  const currentRoute = state.routes[state.index].name;
  const tripId = route?.params?.tripId;

  const handleOpenModal = () => {
    setModalVisible(true);
    loadExpenseTypes();
  };

  const API_BASE_URL = 'http://192.168.100.17/capstone-1-eb';

  const quickAmounts = [100, 500, 1000, 5000];

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

  const loadExpenseTypes = async () => {
    try {
      setLoadingExpenseTypes(true);
      
      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_expense_types'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.expense_types) {
          const typeNames = data.expense_types
            .map(type => type.name)
            .filter(name => name !== 'Other');
          typeNames.push('Other');
          setExpenseCategories(typeNames);
        }
      }
    } catch (error) {
      console.error('Load expense types error:', error.message);
    } finally {
      setLoadingExpenseTypes(false);
    }
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
          resetExpenseData();
        }
      }
    } catch (error) {
      console.error('Initialization error:', error.message);
      Alert.alert('Error', 'Failed to load data');
      resetExpenseData();
    } finally {
      setLoading(false);
    }
  };

  const resetExpenseData = () => {
    setExpenses([]);
    setTotalExpenses(0);
    setTotalBudget(0);
    setRemainingBalance(0);
    setIsEnRoute(false);
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
      
      console.log('Fetching expenses for trip:', targetTripId);
      
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
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Parsed response:', data);
      
      if (data.success) {
        const expensesList = data.expenses || [];
        const budget = parseFloat(data.total_budget) || 0;
        const expenses = parseFloat(data.total_expenses) || 0;
        const balance = data.remaining_balance !== null ? parseFloat(data.remaining_balance) : 0;
        const enRoute = data.is_en_route || false;

        setExpenses(expensesList);
        setTotalBudget(budget);
        setTotalExpenses(expenses);
        setRemainingBalance(balance);
        setIsEnRoute(enRoute);
        
        console.log('Updated state:', {
          expenseCount: expensesList.length,
          budget,
          expenses,
          balance,
          enRoute
        });
        
      } else {
        console.log('API returned error:', data.message);
        resetExpenseData();
        Alert.alert('Error', data.message || 'Failed to load expenses data');
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      resetExpenseData();
      Alert.alert('Error', 'Failed to load expenses. Please check your connection and try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await initializeData();
    setRefreshing(false);
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
    if (text.trim().length === 0) {
      setCustomCategoryError("Category is required.");
    } else if (text.trim().length > 50) {
      setCustomCategoryError("Category name too long (max 50 characters).");
    } else {
      setCustomCategoryError("");
    }
  };

  const handleBlurCustomCategory = () => {
    if (customCategory.trim().length === 0) {
      setCustomCategoryError("Category is required.");
    }
  };
  
  const validateExpenseAmount = (text) => {
    setExpenseAmount(text);
    
    if (text.length === 0) {
      setExpenseAmountError("Amount is required.");
    } else if (isNaN(parseFloat(text))) {
      setExpenseAmountError("Please enter a valid number.");
    } else if (parseFloat(text) > remainingBalance && remainingBalance > 0 && isEnRoute) {
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
    } else if (parseFloat(expenseAmount) > remainingBalance && remainingBalance > 0 && isEnRoute) {
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
    } else if (showCustomInput && customCategory.trim().length > 50) {
      setCustomCategoryError("Category name too long (max 50 characters).");
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
    
    if (tripId && !isNaN(parseInt(tripId)) && parseInt(tripId) > 0) {
      targetTripId = parseInt(tripId);
    } else if (currentTrip && currentTrip.trip_id && !isNaN(parseInt(currentTrip.trip_id)) && parseInt(currentTrip.trip_id) > 0) {
      targetTripId = parseInt(currentTrip.trip_id);
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
      
      console.log('Submitting expense data:', expenseData);
      
      const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
      });

      const responseText = await response.text();
      console.log('Add expense response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Parse error on add expense:', parseError);
        throw new Error('Invalid response from server');
      }
      
      if (data.success) {
        Alert.alert('Success', 'Expense added successfully');
        
        resetForm();
        
        await fetchExpensesByTripId(targetTripId);
        
        await loadExpenseTypes();
      } else {
        console.error('Add expense failed:', data.message);
        Alert.alert('Error', data.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Add expense error:', error.message);
      Alert.alert('Error', 'Failed to add expense. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setExpenseAmount("");
    setCustomCategory("");
    setShowCustomInput(false);
    setExpenseName("Gas");
    setExpenseAmountError("");
    setCustomCategoryError("");
    setModalVisible(false);
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Gas': '⛽',
      'Toll Gate': '🚪',
      'Maintenance': '🔧',
      'Food': '🍽️',
      'Parking': '🅿️',
      'Other': '📝'
    };
    return icons[category] || '💰';
  };

  const getSpendingPercentage = () => {
    if (totalBudget === 0) return 0;
    return Math.min((totalExpenses / totalBudget) * 100, 100);
  };

  const getRemainingPercentage = () => {
    if (totalBudget === 0) return 0;
    return Math.max(100 - getSpendingPercentage(), 0);
  };

  const renderExpenseItem = ({ item, index }) => (
    <View style={[expensestyle.expenseItem, { 
      transform: [{ translateY: index * 2 }], 
      opacity: 1 - (index * 0.02)
    }]}>
      <View style={expensestyle.expenseIconContainer}>
        <Text style={expensestyle.expenseIcon}>
          {getCategoryIcon(item.expense_type || item.expense_type_name)}
        </Text>
      </View>
      <View style={expensestyle.expenseDetails}>
        <Text style={expensestyle.expenseText}>
          {item.expense_type || item.expense_type_name || 'Unknown Expense'}
        </Text>
        <Text style={expensestyle.expenseDate}>
          {item.formatted_date || new Date(item.created_at).toLocaleDateString()}
        </Text>
        {item.destination && (
          <Text style={expensestyle.tripInfo}>
            🚗 {item.destination}
          </Text>
        )}
      </View>
      <View style={expensestyle.amountContainer}>
        <Text style={expensestyle.expenseAmount}>₱{formatCurrency(item.amount)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={expensestyle.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={expensestyle.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <View style={expensestyle.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <View style={expensestyle.header}>
        <View style={expensestyle.headerContent}>
        </View>
      </View>

      <ScrollView 
        style={expensestyle.scrollView}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        <View style={expensestyle.newBalanceSection}>
          <View style={expensestyle.totalBudgetCard}>
            <View style={expensestyle.budgetHeader}>
              <View style={expensestyle.budgetIcon}>
                 <Image 
                   source={require("../assets/wallet2.png")}
                   style={expensestyle.walletIcon}
                   resizeMode="contain"
                 />
              </View>
              <Text style={expensestyle.totalBudgetLabel}>Total Budget</Text>
            </View>
            <Text style={expensestyle.totalBudgetAmount}>₱{formatCurrency(totalBudget)}</Text>
            
            <View style={expensestyle.budgetBreakdown}>
              {currentTrip?.cash_advance > 0 && (
                <View style={expensestyle.budgetBreakdownItem}>
                  <Text style={expensestyle.budgetBreakdownLabel}>Cash Advance:</Text>
                  <Text style={expensestyle.budgetBreakdownValue}>₱{formatCurrency(currentTrip.cash_advance)}</Text>
                </View>
              )}
              {currentTrip?.additional_cash_advance > 0 && (
                <View style={expensestyle.budgetBreakdownItem}>
                  <Text style={expensestyle.budgetBreakdownLabel}>Additional:</Text>
                  <Text style={expensestyle.budgetBreakdownValue}>₱{formatCurrency(currentTrip.additional_cash_advance)}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={expensestyle.statsCardsRow}>
            <View style={expensestyle.spentCard}>
              <View style={expensestyle.cardHeader}>
                <View style={expensestyle.spentIndicator}></View>
                <Text style={expensestyle.cardLabel}>SPENT</Text>
              </View>
              <Text style={expensestyle.spentAmount}>₱{formatCurrency(totalExpenses)}</Text>
              <Text style={expensestyle.spentPercentage}>{getSpendingPercentage().toFixed(1)}% of budget</Text>
            </View>

            <View style={expensestyle.remainingCard}>
              <View style={expensestyle.cardHeader}>
                <View style={expensestyle.remainingIndicator}></View>
                <Text style={expensestyle.cardLabel}>REMAINING</Text>
              </View>
              <Text style={expensestyle.remainingAmount}>₱{formatCurrency(Math.abs(remainingBalance))}</Text>
              <Text style={expensestyle.remainingPercentage}>
                {remainingBalance >= 0 
                  ? `${getRemainingPercentage().toFixed(1)}% available`
                  : 'Over budget'
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={expensestyle.expenseSection}>
          <Text style={expensestyle.sectionTitle}>Recent Transactions</Text>
          
          {expenses.length > 0 ? (
            <View style={expensestyle.expenseList}>
              {expenses.map((item, index) => (
                <View key={`${item.expense_id || index}`}>
                  {renderExpenseItem({ item, index })}
                </View>
              ))}
            </View>
          ) : (
            <View style={expensestyle.emptyState}>
              <Text style={expensestyle.emptyStateIcon}>📊</Text>
              <Text style={expensestyle.emptyStateText}>No expenses recorded yet</Text>
              <Text style={expensestyle.emptyStateSubtext}>Tap the + button to add your first expense</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={expensestyle.fab} 
        onPress={handleOpenModal}
      >
        <Text style={expensestyle.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={true}
        presentationStyle="pageSheet"
      >
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={expensestyle.modalOverlay}>
            <View style={expensestyle.modalContainer}>
              <View style={expensestyle.modalHeader}>
                <Text style={expensestyle.modalTitle}>Add Expense</Text>
                <TouchableOpacity onPress={resetForm} style={expensestyle.modalCloseButton}>
                  <Text style={expensestyle.modalCloseIcon}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={expensestyle.modalContent} showsVerticalScrollIndicator={false}>
                {isEnRoute && (
                  <View style={expensestyle.balanceAlert}>
                    <Text style={expensestyle.balanceAlertIcon}>💳</Text>
                    <Text style={expensestyle.balanceAlertText}>
                      Available: ₱{formatCurrency(remainingBalance)}
                    </Text>
                  </View>
                )}
                
                <View style={expensestyle.inputGroup}>
                  <Text style={expensestyle.inputLabel}>Amount</Text>
                  <TextInput
                    style={[expensestyle.input, expenseAmountError && expensestyle.inputError]}
                    placeholder="₱ 0.00"
                    keyboardType="numeric"
                    value={expenseAmount}
                    onChangeText={validateExpenseAmount}
                    onBlur={handleBlurExpenseAmount}
                  />
                  {expenseAmountError && (
                    <Text style={expensestyle.errorText}>{expenseAmountError}</Text>
                  )}
                </View>

                <View style={expensestyle.quickAmountSection}>
                  <Text style={expensestyle.quickAmountLabel}>Quick amounts</Text>
                  <View style={expensestyle.quickAmountGrid}>
                    {quickAmounts.map((amount) => {
                      const isDisabled = isEnRoute && amount > remainingBalance && remainingBalance > 0;
                      return (
                        <TouchableOpacity
                          key={amount}
                          style={[expensestyle.quickAmountButton, 
                            isDisabled && expensestyle.quickAmountButtonDisabled]}
                          onPress={() => {
                            if (!isDisabled) {
                              setExpenseAmount(amount.toString());
                              setExpenseAmountError("");
                            }
                          }}
                          disabled={isDisabled}
                        >
                          <Text style={[expensestyle.quickAmountText,
                            isDisabled && expensestyle.quickAmountTextDisabled]}>
                            ₱{amount}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
                
                <View style={expensestyle.inputGroup}>
                  <Text style={expensestyle.inputLabel}>Category</Text>
                  <View style={expensestyle.dropdownContainer}>
                    <TouchableOpacity 
                      style={[expensestyle.dropdown, dropdownVisible && expensestyle.dropdownOpen]} 
                      onPress={() => setDropdownVisible(!dropdownVisible)}
                      disabled={loadingExpenseTypes}
                    >
                      <Text style={expensestyle.dropdownText}>
                        {loadingExpenseTypes ? "Loading..." : `${getCategoryIcon(expenseName)} ${expenseName}`}
                      </Text>
                      <Text style={[expensestyle.dropdownArrow, 
                        dropdownVisible && expensestyle.dropdownArrowRotated]}>
                        ▼
                      </Text>
                    </TouchableOpacity>
                    
                    {dropdownVisible && (
                      <View style={expensestyle.dropdownList}>
                        <ScrollView 
                          nestedScrollEnabled={true} 
                          style={expensestyle.dropdownScrollView}
                          showsVerticalScrollIndicator={false}
                        >
                          {expenseCategories.map((category) => (
                            <TouchableOpacity
                              key={category}
                              style={[expensestyle.dropdownItem,
                                expenseName === category && expensestyle.dropdownItemSelected]}
                              onPress={() => handleCategorySelect(category)}
                            >
                              <Text style={expensestyle.dropdownItemIcon}>
                                {getCategoryIcon(category)}
                              </Text>
                              <Text style={[expensestyle.dropdownItemText,
                                expenseName === category && expensestyle.dropdownItemTextSelected]}>
                                {category}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>

                {showCustomInput && (
                  <View style={expensestyle.inputGroup}>
                    <Text style={expensestyle.inputLabel}>Custom Category</Text>
                    <TextInput
                      style={[expensestyle.input, customCategoryError && expensestyle.inputError]}
                      placeholder="Enter category name"
                      value={customCategory}
                      onChangeText={validateCustomCategory}
                      onBlur={handleBlurCustomCategory}
                      maxLength={50}
                    />
                    {customCategoryError && (
                      <Text style={expensestyle.errorText}>{customCategoryError}</Text>
                    )}
                  </View>
                )}

                <View style={expensestyle.buttonGroup}>
                  <TouchableOpacity 
                    style={[expensestyle.submitButton, submitting && expensestyle.buttonDisabled]} 
                    onPress={addExpense} 
                    disabled={submitting}
                  >
                    <Text style={expensestyle.submitButtonText}>
                      {submitting ? 'Adding...' : 'Add Expense'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={expensestyle.cancelButton} 
                    onPress={resetForm} 
                    disabled={submitting}
                  >
                    <Text style={expensestyle.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={navbar.bottomNav}>
          <TouchableOpacity 
              style={[navbar.navButton, currentRoute === "Dashboard" && navbar.navButtonActive]}
              onPress={() => nav.navigate("Dashboard")}
          >
              <Image 
                  source={require("../assets/Home.png")} 
                  style={[
                      navbar.navIconImg, 
                      { tintColor: currentRoute === "Dashboard" ? "red" : "grey" }
                  ]}
              />
              <Text 
                  style={[
                      navbar.navLabel, 
                      currentRoute === "Dashboard" && navbar.navLabelActive
                  ]}
              >
                  Home
              </Text>
          </TouchableOpacity>

          <TouchableOpacity 
              style={[navbar.navButton, currentRoute === "Trips" && navbar.navButtonActive]}
              onPress={() => nav.navigate("Trips")}
          >
              <Image 
                  source={require("../assets/trip.png")} 
                  style={[
                      navbar.navIconImg, 
                      { tintColor: currentRoute === "Trips" ? "red" : "grey" }
                  ]}
              />
              <Text 
                  style={[
                      navbar.navLabel, 
                      currentRoute === "Trips" && navbar.navLabelActive
                  ]}
              >
                  Trips
              </Text>
          </TouchableOpacity>

          <TouchableOpacity 
              style={[navbar.navButton, currentRoute === "Profile" && navbar.navButtonActive]}
              onPress={() => nav.navigate("Profile")}
          >
              <Image 
                  source={require("../assets/user.png")} 
                  style={[
                      navbar.navIconImg, 
                      { tintColor: currentRoute === "Profile" ? "red" : "grey" }
                  ]}
              />
              <Text 
                  style={[
                      navbar.navLabel, 
                      currentRoute === "Profile" && navbar.navLabelActive
                  ]}
              >
                  Profile
              </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}