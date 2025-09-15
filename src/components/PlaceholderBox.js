import React from 'react';
import { View, StyleSheet } from 'react-native';
import Shimmer from './Shimmer';

const PlaceholderBox = ({ style }) => (
  <View style={[styles.box, style]}>
    <Shimmer style={StyleSheet.absoluteFill} />
  </View>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#DDE5ED',
    overflow: 'hidden',
    borderRadius: 6,
  },
});

export default PlaceholderBox;