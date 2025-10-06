import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, AppState } from 'react-native';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import { API_BASE_URL } from '@env';

class NotificationService {
    constructor() {
        this.backendUrl = API_BASE_URL;
        this.listeners = new Set();
        this.isInitialized = false;
        this.projectId = 'mansartrucking1';
        this.appState = AppState.currentState;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            console.log('Initializing NotificationService...');

            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            console.log('📱 Notification permission status:', authStatus, 'Enabled:', enabled);

            if (!enabled) {
                console.log('Notification permission not granted');
                Alert.alert(
                    'Notifications Disabled',
                    'Please enable notifications in your device settings to receive trip updates.',
                    [{ text: 'OK' }]
                );
                return false;
            }

            if (Platform.OS === 'android' && Platform.Version >= 33) {
                await notifee.requestPermission();
            }

    if (Platform.OS === 'android') {
        await notifee.createChannel({
            id: 'mansar_trucking_channel',
            name: 'Mansar Trucking Notifications',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
            vibrationPattern: [300, 500, 300, 500],
            lights: true,
            lightColor: '#FF6B35',
            lockScreenVisibility: 1,
            bypassDnd: true,
            badge: true,
        });
        console.log('Android notification channel created with HIGH importance');
    }


            AppState.addEventListener('change', (nextAppState) => {
                console.log('App state changed:', this.appState, '->', nextAppState);
                this.appState = nextAppState;
            });

            const token = await messaging().getToken();
            console.log('FCM Token obtained:', token ? `${token.substring(0, 20)}...` : 'null');

            await AsyncStorage.setItem('fcm_token', token);
            console.log('FCM Token stored in AsyncStorage');

            messaging().onTokenRefresh(async (newToken) => {
                console.log('FCM Token refreshed:', newToken ? `${newToken.substring(0, 20)}...` : 'null');
                await AsyncStorage.setItem('fcm_token', newToken);
                
                const session = await AsyncStorage.getItem('userSession');
                if (session) {
                    const sessionData = JSON.parse(session);
                    console.log('Re-registering refreshed token for driver:', sessionData.userId);
                    await this.registerTokenWithBackend(sessionData.userId, newToken);
                }
            });

            messaging().onMessage(async (remoteMessage) => {
                console.log('FCM FOREGROUND MESSAGE RECEIVED:', JSON.stringify(remoteMessage, null, 2));
                console.log('Message notification:', remoteMessage.notification);
                console.log('Message data:', remoteMessage.data);

                await this.displayNotificationOnDevice(remoteMessage);
            });

            messaging().setBackgroundMessageHandler(async (remoteMessage) => {
                console.log('Background message received:', remoteMessage);
                return Promise.resolve();
            });

            messaging().onNotificationOpenedApp((remoteMessage) => {
                console.log('Notification opened app from background:', remoteMessage);
                this.handleNotificationTap(remoteMessage);
            });

            messaging()
                .getInitialNotification()
                .then((remoteMessage) => {
                    if (remoteMessage) {
                        console.log('Notification opened app from quit state:', remoteMessage);
                        this.handleNotificationTap(remoteMessage);
                    }
                });

            notifee.onForegroundEvent(({ type, detail }) => {
                if (type === EventType.PRESS) {
                    console.log('User pressed local notification', detail);
                    if (detail.notification?.data) {
                        this.handleNotificationTap({ data: detail.notification.data });
                    }
                }
            });

            this.isInitialized = true;
            console.log('Notification service initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing notifications:', error);
            Alert.alert(
                'Notification Setup Error',
                'Failed to initialize push notifications. You may not receive trip updates.',
                [{ text: 'OK' }]
            );
            return false;
        }
    }

async displayNotificationOnDevice(remoteMessage) {
    const title = remoteMessage.notification?.title || 'Mansar Trucking';
    const body = remoteMessage.notification?.body || 'You have a new notification';
    const data = remoteMessage.data || {};

    try {
        await notifee.displayNotification({
            title: title,
            body: body,
            android: {
                channelId: 'mansar_trucking_channel',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibrationPattern: [500, 1000, 500, 1000],
                pressAction: {
                    id: 'default',
                },
                smallIcon: 'ic_notification',
                color: '#FF6B35',
                timestamp: Date.now(),
            },
            ios: {
                sound: 'default',
                foregroundPresentationOptions: {
                    alert: true,
                    sound: true,
                },
            },
            data: data,
        });
        
        console.log('Trip notification displayed with sound');
    } catch (error) {
        console.error('Error displaying trip notification:', error);
    }
}

async sendTestNotificationWithSound() {
    try {
        await notifee.displayNotification({
            title: 'Sound Test',
            body: 'This should make a sound and vibrate',
            android: {
                channelId: 'mansar_trucking_channel',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibrationPattern: [500, 1000, 500, 1000],
                pressAction: {
                    id: 'default',
                },
                smallIcon: 'ic_notification',
                color: '#FF6B35',
                timestamp: Date.now(),
            },
            ios: {
                sound: 'default',
                foregroundPresentationOptions: {
                    alert: true,
                    sound: true,
                },
            },
        });
        console.log('Test notification with sound sent');
    } catch (error) {
        console.error('Error sending test notification:', error);
    }
}

async checkNotificationSettings() {
    const settings = await notifee.getNotificationSettings();
    console.log('Notification Settings:', settings);

    if (Platform.OS === 'android') {
        const channel = await notifee.getChannel('mansar_trucking_channel');
        console.log('Channel Settings:', channel);
        
        if (channel && channel.blocked) {
            console.log('Notification channel is blocked by user');
        }
        
        if (channel && !channel.sound) {
            console.log('Channel sound is disabled');
        }
    }
    
    return settings;
}
    async handleForegroundMessage(remoteMessage) {
        await this.displayNotificationOnDevice(remoteMessage);
    }

    handleNotificationTap(remoteMessage) {
        const data = remoteMessage.data;
        
        console.log('Handling notification tap with data:', data);
        
        if (data?.type === 'trip_assigned' || data?.type === 'trip_updated') {
            this.notifyListeners({
                type: 'navigate_to_trip',
                tripId: data.trip_id,
                data: data
            });
        } else if (data?.type === 'trip_cancelled') {
            Alert.alert(
                'Trip Cancelled',
                `Your trip to ${data.destination || 'destination'} has been cancelled.`,
                [{ text: 'OK' }]
            );
            
            this.notifyListeners({
                type: 'trip_cancelled',
                data: data
            });
        }
    }

    async registerTokenWithBackend(driverId, token = null) {
        try {
            const fcmToken = token || await AsyncStorage.getItem('fcm_token');
            
            console.log('Registering FCM token with backend...');
            console.log('Driver ID:', driverId);
            console.log('Token:', fcmToken ? `${fcmToken.substring(0, 20)}...` : 'null');
            
            if (!fcmToken || !driverId) {
                console.log('Missing FCM token or driver ID');
                return false;
            }

            const response = await fetch(`${this.backendUrl}/include/handlers/trip_operations.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'register_fcm_token',
                    driver_id: String(driverId),
                    fcm_token: fcmToken,
                    device_type: Platform.OS === 'ios' ? 'ios' : 'android'
                }),
            });

            const data = await response.json();
            
            console.log('Backend response:', data);
            
            if (data.success) {
                console.log('FCM token registered successfully');
                return true;
            } else {
                console.error('Failed to register FCM token:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Error registering FCM token:', error);
            return false;
        }
    }

    async getNotifications(driverId, limit = 50, offset = 0) {
        try {
            console.log('Fetching notifications for driver:', driverId);
            
            const response = await fetch(`${this.backendUrl}/include/handlers/trip_operations.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_notifications',
                    driver_id: String(driverId),
                    limit: limit,
                    offset: offset
                }),
            });

            const data = await response.json();
            
            console.log('Notifications response:', {
                success: data.success,
                count: data.notifications?.length || 0,
                unread: data.unread_count
            });

            if (data.success) {
                return {
                    notifications: data.notifications,
                    unreadCount: data.unread_count,
                    totalCount: data.total_count
                };
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async markAsRead(notificationId, driverId) {
        try {
            const response = await fetch(`${this.backendUrl}/include/handlers/trip_operations.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'mark_notification_read',
                    notification_id: notificationId,
                    driver_id: String(driverId)
                }),
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return false;
        }
    }

    async getUnreadCount(driverId) {
        try {
            const response = await fetch(`${this.backendUrl}/include/handlers/trip_operations.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_unread_count',
                    driver_id: String(driverId)
                }),
            });

            const data = await response.json();
            if (data.success) {
                return data.unread_count;
            }
            return 0;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    }

    async sendTestNotification() {
        try {
            await notifee.displayNotification({
                title: 'Test Notification',
                body: 'This is a test notification from Mansar Trucking',
                android: {
                    channelId: 'mansar_trucking_channel',
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                    sound: 'default',
                    vibrationPattern: [300, 500, 300, 500],
                },
                ios: {
                    sound: 'default',
                },
            });
            console.log('Test notification sent');
        } catch (error) {
            console.error('Error sending test notification:', error);
        }
    }

    addListener(callback) {
        this.listeners.add(callback);
        console.log('Notification listener added, total:', this.listeners.size);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
        console.log('Notification listener removed, total:', this.listeners.size);
    }

    notifyListeners(data) {
        console.log('Notifying listeners:', data.type, 'Count:', this.listeners.size);
        this.listeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in notification listener:', error);
            }
        });
    }
}

export default new NotificationService();