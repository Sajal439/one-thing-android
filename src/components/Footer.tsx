import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Theme } from '../types';

interface FooterProps {
  theme: Theme;
  hasTask: boolean;
  scaleAnim: Animated.Value;
  onComplete: () => void;
  onSave: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  hasTask,
  scaleAnim,
  onComplete,
  onSave,
}) => {
  if (hasTask) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }], width: '100%' }}
        >
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: theme.success }]}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.completeIcon}>✓</Text>
            <Text style={styles.completeText}>Mark Complete</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={[styles.footerHint, { color: theme.subText }]}>
          Complete your task to earn points and keep your streak!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={onSave}
        activeOpacity={0.8}
      >
        <Text style={styles.saveIcon}>→</Text>
        <Text style={styles.saveText}>Set My Focus</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    alignItems: 'center',
    gap: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  completeIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    gap: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footerHint: {
    fontSize: 13,
    textAlign: 'center',
  },
});
