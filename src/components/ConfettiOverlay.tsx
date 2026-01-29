import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface Props {
  opacity: Animated.Value;
}

export const ConfettiOverlay: React.FC<Props> = ({ opacity }) => (
  <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
    <Text style={styles.text}>🎉 🎊 ⭐ 🎉 🎊</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 48,
    textAlign: 'center',
  },
});
