import { firebase } from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';

const db = firebase.firestore();


export const registerUser = async (email, password) => {
    try {
        const userRef = db.collection('Drivers_table').doc(email);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            throw new Error('Email already exists.');
        }

        await userRef.set({
            email,
            password, 
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        return { success: true, message: 'User registered successfully!' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const loginUser = async (email, password) => {
    try {
        const userQuery = await db.collection('Drivers_table').where('email', '==', email).get();

        if (userQuery.empty) {
            throw new Error('Invalid email.');
        }

        const userData = userQuery.docs[0].data();
        if (userData.password !== password) {
            throw new Error('Invalid password.');
        }

        return { success: true, message: 'Login successful!', userData };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const storeLocation = (driverId) => {
    Geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            database()
                .ref(`/locations/${driverId}`)
                .set({ 
                    latitude, 
                    longitude, 
                    timestamp: database.ServerValue.TIMESTAMP 
                })
                .then(() => console.log('Location stored successfully'))
                .catch((error) => console.error('Error saving location:', error));
        },
        (error) => console.error('Location Error:', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
};


export const createTrip = async (driverId, startLocation, destination) => {
    try {
        const tripId = `trip_${Date.now()}`;
        
        await database()
            .ref(`/trips/${tripId}`)
            .set({
                driver_id: driverId,
                start_location: startLocation,
                destination: destination,
                start_time: database.ServerValue.TIMESTAMP,
                status: 'active'
            });
            
        return { success: true, tripId };
    } catch (error) {
        console.error('Error creating trip:', error);
        return { success: false, message: error.message };
    }
};


export const endTrip = async (tripId) => {
    try {
        await database()
            .ref(`/trips/${tripId}`)
            .update({
                end_time: database.ServerValue.TIMESTAMP,
                status: 'completed'
            });
            
        return { success: true };
    } catch (error) {
        console.error('Error ending trip:', error);
        return { success: false, message: error.message };
    }
};


export const logLocationUpdate = async (driverId, tripId, latitude, longitude, sensorType = "gps") => {
    try {
        const logId = `log_${Date.now()}`;
        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });

        await database().ref(`/location_logs/${logId}`).set({
            log_id: logId,
            driver_id: driverId,
            trip_id: tripId,
            latitude,
            longitude,
            timestamp: currentTime, 
            sensor_type: sensorType
        });

        await database().ref(`/locations/${driverId}`).set({
            latitude,
            longitude,
            timestamp: currentTime, 
            trip_id: tripId
        });

        return { success: true, logId };
    } catch (error) {
        console.error("Error logging location:", error);
        return { success: false, message: error.message };
    }
};


export const getTripLocationHistory = async (tripId) => {
    try {
        const snapshot = await database()
            .ref('/location_logs')
            .orderByChild('trip_id')
            .equalTo(tripId)
            .once('value');
            
        const locationHistory = [];
        snapshot.forEach((childSnapshot) => {
            locationHistory.push(childSnapshot.val());
        });
        
        return { success: true, data: locationHistory };
    } catch (error) {
        console.error('Error getting trip history:', error);
        return { success: false, message: error.message };
    }
};

export default db;