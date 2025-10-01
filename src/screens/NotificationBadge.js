import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NotificationService from '../services/NotificationService';

const NotificationBadge = ({ userId }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const intervalRef = useRef(null);

  const animateBadge = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pulseAnim]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      const count = await NotificationService.getUnreadCount(userId);
      setUnreadCount(count);
      if (count > 0) {
        animateBadge();
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [userId, animateBadge]);

  useEffect(() => {
    fetchUnreadCount();

    intervalRef.current = setInterval(fetchUnreadCount, 30000);

    const handleNotification = (data) => {
      if (data.type === 'foreground_message') {
        fetchUnreadCount();
        animateBadge();
      }
    };

    NotificationService.addListener(handleNotification);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      NotificationService.removeListener(handleNotification);
    };
  }, [fetchUnreadCount, animateBadge]);

  const handlePress = () => {
    navigation.navigate('Notifications');
  };

  if (!userId) {
    return null;
  }

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.container}
      activeOpacity={0.7}
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <View style={styles.bellIcon}>
          <View style={styles.bellTop} />
          <View style={styles.bellBottom} />
          <View style={styles.bellClapper} />
        </View>

        {unreadCount > 0 && (
          <Animated.View
            style={[
              styles.badge,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.badgeText} numberOfLines={1}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: 24,
    height: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellTop: {
    width: 20,
    height: 10,
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 1,
  },
  bellBottom: {
    width: 24,
    height: 14,
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  bellClapper: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationBadge;