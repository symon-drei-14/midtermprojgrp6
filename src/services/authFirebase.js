import database from '@react-native-firebase/database';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

// const API_BASE_URL = 'http://192.168.100.17/capstone-1-eb';
const API_BASE_URL = 'http://192.168.1.5/Capstone-1-eb';
// const API_BASE_URL = 'http://192.168.1.3/Capstone-1-eb';

const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
};

export const registerUser = async (email, password, name = "", truckId = null) => {
  try {
    const uniqueId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    

    const hashedPassword = hashPassword(password);
    

    const response = await axios.post(`${API_BASE_URL}/drivers.php`, {
      action: 'register',
      firebase_uid: uniqueId,
      name: name || email.split('@')[0],
      email,
      password: hashedPassword,
      assigned_truck: truckId ? truckId : null
    });
    
    console.log('Registration response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'MySQL registration failed');
    }
      

    await AsyncStorage.setItem('user_email', email);
    await AsyncStorage.setItem('user_id', uniqueId);
    await AsyncStorage.setItem('user_password', hashedPassword);
    await database()
      .ref(`/drivers/${uniqueId}/profile`)
      .set({
        driver_id: uniqueId,
        email,
        name: name || email.split('@')[0],
        status: 'active',
        assigned_truck_id: truckId ? parseInt(truckId) : null,
        createdAt: database.ServerValue.TIMESTAMP
      });

    await database()
      .ref(`/mysql_connections/drivers/${uniqueId}`)
      .set({
        mysql_id: response.data.data.driver_id,
        email,
        connection_type: 'driver',
        last_sync: database.ServerValue.TIMESTAMP
      });

    return { 
      success: true, 
      message: 'User registered successfully!', 
      userId: uniqueId
    };
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Registration failed' 
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const hashedPassword = hashPassword(password);

    const response = await axios.post(`${API_BASE_URL}/drivers.php`, {
      action: 'login',
      email,
      password: hashedPassword
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }
    
    const userData = response.data.data;

    await AsyncStorage.setItem('user_email', email);
    await AsyncStorage.setItem('user_id', userData.firebase_uid);
    await AsyncStorage.setItem('user_password', hashedPassword);
    
    return { 
      success: true, 
      message: 'Login successful!', 
      userData: {
        userId: userData.firebase_uid,
        driverId: userData.driver_id,
        name: userData.name,
        email: userData.email,
        assignedTruck: userData.assigned_truck
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, message: errorMessage };
  }
};

export const testApiConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return {
      success: true,
      message: 'Server is reachable',
      data: response.data
    };
  } catch (error) {
    console.error('API connection test failed:', error);
    return {
      success: false,
      message: 'Server connection failed',
      error: {
        message: error.message,
        status: error.response?.status || 'unknown'
      }
    };
  }
};

export const checkEndpoints = async () => {
  const endpoints = [
    '/drivers.php',
    '/api/auth.php',
    '/auth.php'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      await axios.get(`${API_BASE_URL}${endpoint}`);
      results[endpoint] = 'Endpoint exists';
    } catch (error) {
      results[endpoint] = `Status: ${error.response?.status || 'unknown'}`;
    }
  }
  
  console.log('Endpoint check results:', results);
  return results;
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('user_email');
    await AsyncStorage.removeItem('user_id');
    await AsyncStorage.removeItem('user_password');
    
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: error.message };
  }
};

export default { 
  registerUser, 
  loginUser, 
  logoutUser,
  testApiConnection,
  checkEndpoints
};