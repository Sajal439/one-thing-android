import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../types';

interface Props {
  theme: Theme;
  streak: number;
  points: number;
}

export const Header: React.FC<Props> = ({ theme, streak, points }) => (
  <>
    <Text style={[styles.title, { color: theme.text }]}>ONE THING</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
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
