import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Theme } from '../types';

interface Props {
  theme: Theme;
  hasTask: boolean;
  scaleAnim: Animated.Value;
  onComplete: () => void;
  onSave: () => void;
}

export const Footer: React.FC<Props> = ({
  theme,
  hasTask,
  scaleAnim,
  onComplete,
  onSave,
}) => (
  <View style={styles.footer}>
    {hasTask ? (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          style={({ pressed }) => [
            styles.doneBtn,
            { backgroundColor: theme.success },
            pressed && { opacity: 0.8 },
          ]}
          onPress={onComplete}
        >
          <Text style={styles.btnText}>✓ I Did it</Text>
        </Pressable>
      </Animated.View>
    ) : (
      <Pressable
        style={({ pressed }) => [
          styles.commitBtn,
          { backgroundColor: theme.primary },
          pressed && { opacity: 0.85 },
        ]}
        onPress={onSave}
      >
        <Text style={styles.btnText}>Lock it in</Text>
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  footer: {
    width: '100%',
  },
  commitBtn: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneBtn: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
