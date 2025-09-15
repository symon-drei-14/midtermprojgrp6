import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const Shimmer = ({ style }) => {
  const anim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [anim]);

  const translateX = anim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.wrapper, style]}>
      <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: width * 1.5, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { overflow: 'hidden', backgroundColor: '#E6EEF2' },
  shimmer: { position: 'absolute', top: 0, left: 0, bottom: 0 },
});

export default Shimmer;