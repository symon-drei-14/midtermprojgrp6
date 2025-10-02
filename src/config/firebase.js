import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';

const db = firestore();

export const registerUser = async (email, name = "") => {
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
            name,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        await database()
            .ref(`/drivers/${userId}/profile`)
            .set({
                email,
                name,
                createdAt: database.ServerValue.TIMESTAMP
            });

        await database()
            .ref(`/drivers/${userId}/status`)
            .set('offline');

        return { success: true, message: 'User registered successfully!', userId };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const loginUser = async (email, password) => {
    try {
        const snapshot = await db
            .collection('Drivers_table')
            .where('email', '==', email)
            .where('password', '==', password)
            .get();

        if (snapshot.empty) {
            throw new Error('Invalid email or password.');
        }

        const userDoc = snapshot.docs[0];
        const userId = userDoc.id;

        await db.collection('Drivers_table').doc(userId).update({
            lastLogin: firestore.FieldValue.serverTimestamp(),
        });

        await database()
            .ref(`/drivers/${userId}/status`)
            .set('offline');

        return { 
            success: true, 
            message: 'Login successful!', 
            userId 
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const storeLocation = (driverId, driverName = null) => {
    Geolocation.getCurrentPosition(
        async (position) => {
            try {
                await database()
                    .ref(`/drivers/${driverId}/location`)
                    .set({
                        driverName: driverName || "",
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        last_updated: database.ServerValue.TIMESTAMP
                    });
            } catch (error) {
                console.error('Error storing location:', error);
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
};

export const endTrip = async (driverId, truckId) => {
    try {
        await database()
            .ref(`/truck_assignments/${driverId}_${truckId}`)
            .update({
                status: 'completed',
                end_time: database.ServerValue.TIMESTAMP
            });

        await database()
            .ref(`/drivers/${driverId}/status`)
            .set('offline');

        return { success: true };
    } catch (error) {
        console.error('Error ending truck assignment:', error);
        return { success: false, message: error.message };
    }
};

export const updateDriverStatus = async (driverId, status) => {
    try {
        await database()
            .ref(`/drivers/${driverId}/status`)
            .set(status);
        
        console.log(`Driver status updated to: ${status}`);
        return { success: true };
    } catch (error) {
        console.error('Error updating driver status:', error);
        return { success: false, message: error.message };
    }
};

export const getDriverStatus = async (driverId) => {
    try {
        const snapshot = await database()
            .ref(`/drivers/${driverId}/status`)
            .once('value');
        
        return snapshot.val() || 'offline';
    } catch (error) {
        console.error('Error getting driver status:', error);
        return 'offline';
    }
};

export default db;