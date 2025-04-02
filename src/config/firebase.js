import { firebase } from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';

const db = firebase.firestore();

export const registerUser = async (email, password, name = "") => {
    try {
        const userRef = db.collection('Drivers_table').doc();
        const userId = userRef.id;

        const emailQuery = await db
            .collection('Drivers_table')
            .where('email', '==', email)
            .get();
            
        if (!emailQuery.empty) {
            throw new Error('Email already exists.');
        }

        await userRef.set({
            userId,
            email,
            password, 
            name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await database()
            .ref(`/drivers/${userId}/profile`)
            .set({
                email,
                name: name || email.split('@')[0],
                status: 'active',
                createdAt: database.ServerValue.TIMESTAMP
            });

        return { success: true, message: 'User registered successfully!', userId };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const loginUser = async (email, password) => {
    try {
        const userQuery = await db.collection('Drivers_table')
            .where('email', '==', email)
            .get();

        if (userQuery.empty) {
            throw new Error('Invalid email.');
        }

        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        if (userData.password !== password) {
            throw new Error('Invalid password.');
        }

        await userDoc.ref.update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        });

        return { 
            success: true, 
            message: 'Login successful!', 
            userData: { ...userData, userId } 
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const storeLocation = (driverId, driverName = null) => {
    Geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            database()
                .ref(`/drivers/${driverId}/current_location`)
                .set({ 
                    latitude, 
                    longitude,
                    driver_name: driverName, 
                    timestamp: database.ServerValue.TIMESTAMP 
                })
                .then(() => console.log('Location stored successfully'))
                .catch((error) => console.error('Error saving location:', error));
        },
        (error) => console.error('Location Error:', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
};

export const endTrip = async (driverId, truckId) => {
    try {
        await database()
            .ref(`/trucks/${truckId}`)
            .update({
                end_time: database.ServerValue.TIMESTAMP,
                status: 'completed'
            });

        await database()
            .ref(`/drivers/${driverId}/assigned_truck`)
            .update({
                status: 'completed',
                end_time: database.ServerValue.TIMESTAMP
            });
            
        return { success: true };
    } catch (error) {
        console.error('Error ending truck assignment:', error);
        return { success: false, message: error.message };
    }
};

export default db;