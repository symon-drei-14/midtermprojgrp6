import React, { useState, useEffect } from 'react';
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
  const [pulseAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    const handleNotification = (data) => {
      if (data.type === 'foreground_message') {
        fetchUnreadCount();
        animateBadge();
      }
    };

    NotificationService.addListener(handleNotification);

    return () => {
      clearInterval(interval);
      NotificationService.removeListener(handleNotification);
    };
  }, [userId]);

  const fetchUnreadCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount(userId);
      setUnreadCount(count);
      if (count > 0) {
        animateBadge();
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const animateBadge = () => {
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
  };

  const handlePress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.bellIcon}>
          <View style={styles.bellTop} />
          <View style={styles.bellBottom} />
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
            <Text style={styles.badgeText}>
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
  },
  bellIcon: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  bellTop: {
    width: 20,
    height: 10,
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: 2,
  },
  bellBottom: {
    width: 24,
    height: 14,
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
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
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationBadge;