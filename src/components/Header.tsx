import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../types';

interface Props {
  theme: Theme;
  streak: number;
  points: number;
  onHistoryPress: () => void;
}

export const Header: React.FC<Props> = ({
  theme,
  streak,
  points,
  onHistoryPress,
}) => (
  <>
    <View style={styles.titleRow}>
      <View style={styles.placeholder} />
      <Text style={[styles.title, { color: theme.text }]}>ONE THING</Text>
      <TouchableOpacity onPress={onHistoryPress} style={styles.historyButton}>
        <Text style={[styles.historyIcon, { color: theme.text }]}>📋</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.statsRow}>
      <Text style={[styles.streak, { color: theme.subText }]}>
        🔥 {streak} day streak
      </Text>
      <Text style={[styles.points, { color: theme.warning }]}>
        ⭐ {points} pts
      </Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  historyButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    gap: 16,
  },
  streak: {
    fontSize: 14,
    opacity: 0.6,
  },
  points: {
    fontSize: 14,
    fontWeight: '600',
  },
});
