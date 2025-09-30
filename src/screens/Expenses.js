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
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { navbar } from "../styles/Navbar";
import { expensestyle } from "../styles/Expensescss";
import { useNavigationState } from "@react-navigation/native";
import homeIcon from "../assets/Home.png";
import userIcon from "../assets/schedule.png";
import profileicon from "../assets/profile2.png";
import { tripstyle } from "../styles/Tripcss";
import ExpensesSkeleton from "../components/ExpensesSkeleton"; 

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [receiptImage, setReceiptImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
 
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [viewingReceiptUri, setViewingReceiptUri] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const state = useNavigationState((state) => state);
  const currentRoute = state.routes[state.index].name;
  const tripId = route?.params?.tripId;

const handleOpenModal = () => {
  resetForm(); // Clear all previous data
  setModalVisible(true); // Now, open the modal
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

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload receipt images.');
      }
    })();
  }, []);

const pickImage = async () => {
  const options = {
    mediaType: 'photo',
    includeBase64: false,
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    allowsEditing: false,
    aspect: [4, 3],
    exif: false,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorCode, response.errorMessage);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } else if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];

      if (asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('File Too Large', 'Please select an image smaller than 5MB.');
        return;
      }

      setReceiptImage({
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `receipt_${Date.now()}.jpg`,
        fileSize: asset.fileSize
      });
      
      console.log('Image selected:', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName,
        size: asset.fileSize
      });
    }
  });
};


  const removeImage = () => {
    setReceiptImage(null);
  };

const uploadImage = async (imageData) => {
  try {
    setUploadingImage(true);
    console.log('Starting upload with data:', {
      uri: imageData.uri,
      type: imageData.type,
      name: imageData.name
    });

    const formData = new FormData();
    formData.append('action', 'upload_receipt');

    const fileObject = {
      uri: imageData.uri,
      type: imageData.type || 'image/jpeg',
      name: imageData.name || `receipt_${Date.now()}.jpg`,
    };

    formData.append('image', fileObject);

    console.log('Sending request to:', `${API_BASE_URL}/include/handlers/upload_handler.php`);
    console.log('FormData contents:', formData);

    const response = await fetch(`${API_BASE_URL}/include/handlers/upload_handler.php`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);
      throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 200)}...`);
    }
    
    if (data.success) {
      console.log('Upload successful:', data);
      return data.image_path;
    } else {
      console.error('Upload failed:', data.message);
      throw new Error(data.message || 'Upload failed');
    }
    
  } catch (error) {
    console.error('Image upload error:', error);

    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      throw new Error('Network error: Please check your internet connection and server availability.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Upload timeout: The file might be too large or connection is slow.');
    } else {
      throw new Error(error.message || 'Failed to upload image. Please try again.');
    }
  } finally {
    setUploadingImage(false);
  }
};

const handleViewReceipt = (uri) => {
    if (uri) {
      setViewingReceiptUri(uri);
      setReceiptModalVisible(true);
    }
  };

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
    console.log("--- Checking State Inside addExpense ---");
  console.log("Value of currentTrip:", currentTrip);
  console.log("Value of tripId from route:", tripId);
  console.log("------------------------------------");
  let hasError = false;
  const expenseAmountNum = parseFloat(expenseAmount);
  if (!expenseAmount || isNaN(expenseAmountNum) || expenseAmountNum <= 0) {
    setExpenseAmountError("A valid amount is required.");
    hasError = true;
  } else {
    setExpenseAmountError("");
  }
  if (showCustomInput && !customCategory.trim()) {
    setCustomCategoryError("Category is required.");
    hasError = true;
  } else {
    setCustomCategoryError("");
  }
  if (hasError) return;

  // --- Data Preparation ---
  if (!driverInfo || !driverInfo.driver_id || parseInt(driverInfo.driver_id, 10) <= 0) {
    Alert.alert('Error', 'Driver information is invalid. Please try logging out and back in.');
    return;
  }

  // This logic now correctly and reliably uses the active trip's ID.
  if (!currentTrip || !currentTrip.trip_id) {
    Alert.alert('Error', 'Could not find an active trip. The trip may have recently ended.');
    return;
  }
  
  const targetTripId = parseInt(currentTrip.trip_id, 10);

  // Final check to ensure the ID is a valid number
  if (isNaN(targetTripId) || targetTripId <= 0) {
    Alert.alert('Error', 'The active trip has an invalid ID. Please contact support.');
    return;
  }

  setSubmitting(true);
  try {
    let imagePath = null;
    if (receiptImage && receiptImage.uri && !receiptImage.uri.startsWith('http')) {
      imagePath = await uploadImage(receiptImage);
    }

    const expenseData = {
      action: 'add_expense',
      trip_id: targetTripId,
      driver_id: parseInt(driverInfo.driver_id, 10),
      expense_type: showCustomInput ? customCategory.trim() : expenseName,
      amount: expenseAmountNum,
      receipt_image: imagePath,
    };
    
    const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });

    const resultText = await response.text();
    if (!response.ok) {
        throw new Error(`Server Error: ${resultText}`);
    }
    const result = JSON.parse(resultText);

    if (!result.success) {
      throw new Error(result.message || 'The server returned an error.');
    }

    Alert.alert('Success', 'Expense added successfully!');
    setModalVisible(false);
    await initializeData();

  } catch (error) {
    Alert.alert('Error', `Failed to add expense: ${error.message}`);
  } finally {
    setSubmitting(false);
  }
};

const handleOpenEditModal = (expense) => {
  if (!expense) return;
  setEditingExpense(expense); // Set the expense to be edited

  // Pre-fill the form with the expense's data
  setExpenseAmount(String(expense.amount));
  setExpenseName(expense.expense_type);

  // Handle custom categories
  const predefinedCategories = ["Gas", "Toll Gate", "Maintenance", "Food", "Parking", "Other"];
  if (!predefinedCategories.includes(expense.expense_type)) {
    setShowCustomInput(true);
    setCustomCategory(expense.expense_type);
  } else {
    setShowCustomInput(false);
    setCustomCategory("");
  }

  // Set the receipt image if it exists
  if (expense.receipt_image) {
    setReceiptImage({ uri: `${API_BASE_URL}/${expense.receipt_image}` });
  } else {
    setReceiptImage(null);
  }

  setModalVisible(true); // Open the modal
};

const updateExpense = async () => {
    if (!editingExpense) return;

    // --- Validation (same as addExpense) ---
    let hasError = false;
    const expenseAmountNum = parseFloat(expenseAmount);

    if (expenseAmount.trim().length === 0 || isNaN(expenseAmountNum) || expenseAmountNum <= 0) {
        setExpenseAmountError("A valid amount is required.");
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
    if (hasError) return;

    setSubmitting(true);
    try {
        let updatedImagePath = editingExpense.receipt_image;

        // Check if the user selected a NEW local image to upload
        if (receiptImage && receiptImage.uri && !receiptImage.uri.startsWith('http')) {
            updatedImagePath = await uploadImage(receiptImage);
        } else if (!receiptImage) {
            // Check if the user removed the image
            updatedImagePath = null;
        }

        const expenseData = {
            action: 'update_expense',
            expense_id: editingExpense.expense_id,
            trip_id: editingExpense.trip_id,
            expense_type: showCustomInput ? customCategory.trim() : expenseName,
            amount: expenseAmountNum,
            receipt_image: updatedImagePath,
        };

        const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData),
        });

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to update expense.');
        }

        Alert.alert('Success', 'Expense updated successfully!');
        resetForm();
        await initializeData(); // Refresh the list

    } catch (error) {
        Alert.alert('Error', `Update failed: ${error.message}`);
    } finally {
        setSubmitting(false);
    }
};

const handleDeleteExpense = () => {
    if (!editingExpense) return;

    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this expense? This action cannot be undone.",
        [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    setSubmitting(true);
                    try {
                        const response = await fetch(`${API_BASE_URL}/include/handlers/expense_handler.php`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'delete_expense',
                                expense_id: editingExpense.expense_id,
                            }),
                        });
                        const result = await response.json();
                        if (!result.success) {
                            throw new Error(result.message || "Failed to delete from server.");
                        }
                        Alert.alert('Success', 'Expense deleted successfully!');
                        resetForm();
                        await initializeData();
                    } catch (error) {
                        Alert.alert('Error', `Deletion failed: ${error.message}`);
                    } finally {
                        setSubmitting(false);
                    }
                },
            },
        ]
    );
};

const testServerConnection = async () => {
  try {
    console.log('Testing connection to:', `${API_BASE_URL}/include/handlers/upload_handler.php`);
    
    const response = await fetch(`${API_BASE_URL}/include/handlers/upload_handler.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'test',
        timestamp: Date.now()
      })
    });
    
    console.log('Test response status:', response.status);
    const text = await response.text();
    console.log('Test response body:', text);
    
    Alert.alert('Connection Test', `Status: ${response.status}\nResponse: ${text.substring(0, 200)}`);
    
  } catch (error) {
    console.error('Connection test failed:', error);
    Alert.alert('Connection Failed', error.message);
  }
};

const resetForm = () => {
  setEditingExpense(null);
  setExpenseAmount("");
  setCustomCategory("");
  setShowCustomInput(false);
  setExpenseName("Gas");
  setExpenseAmountError("");
  setCustomCategoryError("");
  setReceiptImage(null);
  setModalVisible(false); // It should CLOSE the modal, not open it.
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

 const renderExpenseItem = ({ item, index }) => {
  const fullImageUrl = item.receipt_image ? `${API_BASE_URL}/${item.receipt_image}` : null;

  return (
    <TouchableOpacity
      onPress={() => handleOpenEditModal(item)} 
      style={[expensestyle.expenseItem, {
        transform: [{ translateY: index * 2 }],
        opacity: 1 - (index * 0.02)
      }]}>
      <View style={expensestyle.expenseIconContainer}>
        <Text style={expensestyle.expenseIcon}>
          {getCategoryIcon(item.expense_type || item.expense_type_name)}
        </Text>
      </View>
      <View style={expensestyle.expenseDetails}>
        <View style={expensestyle.expenseHeader}>
          <Text style={expensestyle.expenseText}>
            {item.expense_type || item.expense_type_name || 'Unknown Expense'}
          </Text>
          {item.receipt_image && (
             <TouchableOpacity onPress={(e) => {
                 e.stopPropagation(); // Prevents the edit modal from opening
                 handleViewReceipt(fullImageUrl);
             }}>
                <Text style={expensestyle.receiptIndicator}>📎</Text>
             </TouchableOpacity>
          )}
        </View>
        <Text style={expensestyle.expenseDate}>
          {item.formatted_date || new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={expensestyle.amountContainer}>
        <Text style={expensestyle.expenseAmount}>₱{formatCurrency(item.amount)}</Text>
      </View>
    </TouchableOpacity>
  );
};

  if (loading) {
    return <ExpensesSkeleton />;
  }

  return (
  <View style={expensestyle.container}>
    <StatusBar barStyle="light-content" backgroundColor="#667eea" />

    <View style={expensestyle.header}>
      <Text style={expensestyle.headerTitle}>Expenses</Text>
      <View style={expensestyle.headerContent}></View>
    </View>

    <ScrollView
      style={expensestyle.scrollView}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      {isEnRoute ? (
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
            <Text style={expensestyle.totalBudgetAmount}>
              ₱{formatCurrency(totalBudget)}
            </Text>

            <View style={expensestyle.budgetBreakdown}>
              {currentTrip?.cash_advance > 0 && (
                <View style={expensestyle.budgetBreakdownItem}>
                  <Text style={expensestyle.budgetBreakdownLabel}>
                    Cash Advance:
                  </Text>
                  <Text style={expensestyle.budgetBreakdownValue}>
                    ₱{formatCurrency(currentTrip.cash_advance)}
                  </Text>
                </View>
              )}
              {currentTrip?.additional_cash_advance > 0 && (
                <View style={expensestyle.budgetBreakdownItem}>
                  <Text style={expensestyle.budgetBreakdownLabel}>
                    Additional:
                  </Text>
                  <Text style={expensestyle.budgetBreakdownValue}>
                    ₱{formatCurrency(currentTrip.additional_cash_advance)}
                  </Text>
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
              <Text style={expensestyle.spentAmount}>
                ₱{formatCurrency(totalExpenses)}
              </Text>
              <Text style={expensestyle.spentPercentage}>
                {getSpendingPercentage().toFixed(1)}% of budget
              </Text>
            </View>

            <View style={expensestyle.remainingCard}>
              <View style={expensestyle.cardHeader}>
                <View style={expensestyle.remainingIndicator}></View>
                <Text style={expensestyle.cardLabel}>REMAINING</Text>
              </View>
              <Text style={expensestyle.remainingAmount}>
                ₱{formatCurrency(Math.abs(remainingBalance))}
              </Text>
              <Text style={expensestyle.remainingPercentage}>
                {remainingBalance >= 0
                  ? `${getRemainingPercentage().toFixed(1)}% available`
                  : "Over budget"}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        // Message when trip is not en route
        <View style={expensestyle.statusMessage}>
          <Text style={expensestyle.statusMessageIcon}>📋</Text>
          <Text style={expensestyle.statusMessageText}>Trip Not Active</Text>
          <Text style={expensestyle.statusMessageSubtext}>
            Budget information is only available for trips that are en route
          </Text>
        </View>
      )}

      {/* Expenses Section */}
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
            <Text style={expensestyle.emptyStateText}>
              No expenses recorded yet
            </Text>
            <Text style={expensestyle.emptyStateSubtext}>
              {isEnRoute
                ? "Tap the + button to add your first expense"
                : "Expenses will appear here when the trip becomes active"}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>

    {isEnRoute && (
      <TouchableOpacity style={expensestyle.fab} onPress={handleOpenModal}>
        <Text style={expensestyle.fabIcon}>+</Text>
      </TouchableOpacity>
    )}

    <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={resetForm} 
>
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={expensestyle.keyboardAvoidingView}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={expensestyle.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={expensestyle.modalContainer}>
            {/* ---- MODAL HEADER ---- */}
            <View style={expensestyle.modalHeader}>
              <Text style={expensestyle.modalTitle}>
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </Text>
             
              <TouchableOpacity
                onPress={resetForm}
                style={expensestyle.modalCloseButton}
              >
                <Text style={expensestyle.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ---- SCROLLABLE FORM CONTENT ---- */}
            <ScrollView
              style={expensestyle.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {isEnRoute && (
                <View style={expensestyle.balanceAlert}>
                  <Text style={expensestyle.balanceAlertIcon}>💳</Text>
                  <Text style={expensestyle.balanceAlertText}>
                    Available: ₱{formatCurrency(remainingBalance)}
                  </Text>
                </View>
              )}

              {/* ---- AMOUNT INPUT ---- */}
              <View style={expensestyle.inputGroup}>
                <Text style={expensestyle.inputLabel}>Amount</Text>
                <TextInput
                  style={[
                    expensestyle.input,
                    expenseAmountError && expensestyle.inputError,
                  ]}
                  placeholder="₱ 0.00"
                  keyboardType="numeric"
                  value={expenseAmount}
                  onChangeText={validateExpenseAmount}
                  onBlur={handleBlurExpenseAmount}
                />
                {expenseAmountError && (
                  <Text style={expensestyle.errorText}>
                    {expenseAmountError}
                  </Text>
                )}
              </View>

              {/* ---- QUICK AMOUNTS ---- */}
              <View style={expensestyle.quickAmountSection}>
                <Text style={expensestyle.quickAmountLabel}>Quick amounts</Text>
                <View style={expensestyle.quickAmountGrid}>
                  {quickAmounts.map((amount) => {
                    const isDisabled =
                      isEnRoute && amount > remainingBalance && remainingBalance > 0;
                    return (
                      <TouchableOpacity
                        key={amount}
                        style={[
                          expensestyle.quickAmountButton,
                          isDisabled && expensestyle.quickAmountButtonDisabled,
                        ]}
                        onPress={() => {
                          if (!isDisabled) {
                            setExpenseAmount(amount.toString());
                            setExpenseAmountError("");
                          }
                        }}
                        disabled={isDisabled}
                      >
                        <Text
                          style={[
                            expensestyle.quickAmountText,
                            isDisabled && expensestyle.quickAmountTextDisabled,
                          ]}
                        >
                          ₱{amount}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ---- CATEGORY DROPDOWN ---- */}
              <View style={expensestyle.inputGroup}>
                <Text style={expensestyle.inputLabel}>Category</Text>
                <View style={expensestyle.dropdownContainer}>
                  <TouchableOpacity
                    style={[
                      expensestyle.dropdown,
                      dropdownVisible && expensestyle.dropdownOpen,
                    ]}
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                    disabled={loadingExpenseTypes}
                  >
                    <Text style={expensestyle.dropdownText}>
                      {loadingExpenseTypes
                        ? "Loading..."
                        : `${getCategoryIcon(expenseName)} ${expenseName}`}
                    </Text>
                    <Text
                      style={[
                        expensestyle.dropdownArrow,
                        dropdownVisible && expensestyle.dropdownArrowRotated,
                      ]}
                    >
                      ▼
                    </Text>
                  </TouchableOpacity>

                  {dropdownVisible && (
                    <View style={expensestyle.dropdownList}>
                      <ScrollView
                        nestedScrollEnabled={true}
                        style={expensestyle.dropdownScrollView}
                      >
                        {expenseCategories.map((category) => (
                          <TouchableOpacity
                            key={category}
                            style={[
                              expensestyle.dropdownItem,
                              expenseName === category &&
                                expensestyle.dropdownItemSelected,
                            ]}
                            onPress={() => handleCategorySelect(category)}
                          >
                            <Text style={expensestyle.dropdownItemIcon}>
                              {getCategoryIcon(category)}
                            </Text>
                            <Text
                              style={[
                                expensestyle.dropdownItemText,
                                expenseName === category &&
                                  expensestyle.dropdownItemTextSelected,
                              ]}
                            >
                              {category}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              {/* ---- CUSTOM CATEGORY INPUT ---- */}
              {showCustomInput && (
                <View style={expensestyle.inputGroup}>
                  <Text style={expensestyle.inputLabel}>Custom Category</Text>
                  <TextInput
                    style={[
                      expensestyle.input,
                      customCategoryError && expensestyle.inputError,
                    ]}
                    placeholder="Enter category name"
                    value={customCategory}
                    onChangeText={validateCustomCategory}
                    onBlur={handleBlurCustomCategory}
                    maxLength={50}
                  />
                  {customCategoryError && (
                    <Text style={expensestyle.errorText}>
                      {customCategoryError}
                    </Text>
                  )}
                </View>
              )}
              
              {/* ---- RECEIPT UPLOAD / PREVIEW ---- */}
              <View style={expensestyle.inputGroup}>
                <Text style={expensestyle.inputLabel}>Receipt</Text>
                {!receiptImage ? (
                  <TouchableOpacity
                    style={expensestyle.imageUploadButton}
                    onPress={pickImage}
                    disabled={uploadingImage}
                  >
                    <View style={expensestyle.imageUploadContent}>
                      <Text style={expensestyle.imageUploadIcon}>📷</Text>
                      <Text style={expensestyle.imageUploadText}>
                        {uploadingImage ? 'Processing...' : 'Add Receipt Photo'}
                      </Text>
                      <Text style={expensestyle.imageUploadSubtext}>
                        Tap to select from gallery
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={expensestyle.imagePreviewContainer}>
                    <TouchableOpacity onPress={() => handleViewReceipt(receiptImage.uri)}>
                      <Image
                        source={{ uri: receiptImage.uri }}
                        style={expensestyle.imagePreview}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={expensestyle.removeImageButton}
                      onPress={removeImage}
                    >
                      <Text style={expensestyle.removeImageIcon}>✕</Text>
                    </TouchableOpacity>
                    <View style={expensestyle.imageInfo}>
                      <Text style={expensestyle.imageInfoText}>Receipt attached</Text>
                      <TouchableOpacity onPress={pickImage}>
                        <Text style={expensestyle.changeImageText}>Change photo</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

                    {/* ---- ACTION BUTTONS ---- */}
                <View style={expensestyle.buttonGroup}>
                    {/* ... your submit button ... */}
                    <TouchableOpacity
                      style={[
                        expensestyle.submitButton,
                        (submitting || uploadingImage) && expensestyle.buttonDisabled,
                      ]}
                      onPress={editingExpense ? updateExpense : addExpense}
                      disabled={submitting || uploadingImage}
                    >
                      <Text style={expensestyle.submitButtonText}>
                        {submitting
                          ? "Saving..."
                          : editingExpense
                          ? "Update Expense"
                          : "Add Expense"}
                      </Text>
                    </TouchableOpacity>

                    {/* ... your delete button (if editing) ... */}
                    {editingExpense && (
                      <TouchableOpacity
                        style={[
                          expensestyle.deleteButton,
                          (submitting || uploadingImage) && expensestyle.buttonDisabled,
                        ]}
                        onPress={() => handleDeleteExpense(editingExpense)}
                        disabled={submitting || uploadingImage}
                      >
                        <Text style={expensestyle.deleteButtonText}>Delete Expense</Text>
                      </TouchableOpacity>
                    )}
                    
                    {/* This button's onPress should also call resetForm */}
                    <TouchableOpacity
                      style={expensestyle.cancelButton}
                      onPress={resetForm}
                      disabled={submitting || uploadingImage}
                    >
                      <Text style={expensestyle.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
</Modal>

    <Modal
      visible={receiptModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setReceiptModalVisible(false)}
    >
      <View style={expensestyle.receiptModalContainer}>
        <Image
          source={{ uri: viewingReceiptUri }}
          style={expensestyle.receiptModalImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={expensestyle.receiptModalCloseButton}
          onPress={() => setReceiptModalVisible(false)}
        >
          <Text style={expensestyle.receiptModalCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>

      <View style={tripstyle.bottomNav}>
                      <TouchableOpacity
                          style={[tripstyle.navButton, currentRoute === "Dashboard" && tripstyle.navButtonActive]}
                          onPress={() => nav.navigate("Dashboard")}
                      >
                          <View style={tripstyle.navIconContainer}>
                              <Image
                                  source={require("../assets/Home.png")}
                                  style={[
                                      tripstyle.navIcon,
                                      { tintColor: currentRoute === "Dashboard" ? "#dc2626" : "#9ca3af" }
                                  ]}
                              />
                          </View>
                          <Text
                              style={[
                                  tripstyle.navLabel,
                                  { color: currentRoute === "Dashboard" ? "#dc2626" : "#9ca3af" }
                              ]}
                          >
                              Home
                          </Text>
                      </TouchableOpacity>
      
                      <TouchableOpacity
                          style={[tripstyle.navButton, currentRoute === "Notifications" && tripstyle.navButtonActive]}
                          onPress={() => nav.navigate("Notifications")}
                      >
                          <View style={tripstyle.navIconContainer}>
                          <Image
                              source={require("../assets/bell.png")}
                              style={[tripstyle.navIcon, { 
                              tintColor: currentRoute === "Notifications" ? "#dc2626" : "#9ca3af" 
                          }]}
                          />
                              {unreadCount > 0 && (
                                  <View style={tripstyle.navBadge}>
                                      <Text style={tripstyle.navBadgeText}>
                                          {unreadCount > 9 ? '9+' : unreadCount}
                                       </Text>
                                  </View>
                              )}
                                  </View>
                              <Text style={[tripstyle.navLabel, { 
                              color: currentRoute === "Notifications" ? "#dc2626" : "#9ca3af" 
                                  }]}>
                          Notifications
                          </Text>
                      </TouchableOpacity>
      
                      <TouchableOpacity
                          style={[tripstyle.navButton, currentRoute === "Trips" && tripstyle.navButtonActive]}
                          onPress={() => nav.navigate("Trips")}
                      >
                          <View style={tripstyle.navIconContainer}>
                              <Image
                                  source={require("../assets/location2.png")}
                                  style={[
                                      tripstyle.navIcon,
                                      { tintColor: currentRoute === "Trips" ? "#dc2626" : "#9ca3af" }
                                  ]}
                              />
                          </View>
                          <Text
                              style={[
                                  tripstyle.navLabel,
                                  { color: currentRoute === "Trips" ? "#dc2626" : "#9ca3af" }
                              ]}
                          >
                              Trips
                          </Text>
                      </TouchableOpacity>
      
                      <TouchableOpacity
                          style={[tripstyle.navButton, currentRoute === "Profile" && tripstyle.navButtonActive]}
                          onPress={() => nav.navigate("Profile")}
                      >
                          <View style={tripstyle.navIconContainer}>
                              <Image
                                  source={require("../assets/user.png")}
                                  style={[
                                      tripstyle.navIcon,
                                      { tintColor: currentRoute === "Profile" ? "#dc2626" : "#9ca3af" }
                                  ]}
                              />
                          </View>
                          <Text
                              style={[
                                  tripstyle.navLabel,
                                  { color: currentRoute === "Profile" ? "#dc2626" : "#9ca3af" }
                              ]}
                          >
                              Profile
                          </Text>
                      </TouchableOpacity>
                  </View>
  </View>
  );
}