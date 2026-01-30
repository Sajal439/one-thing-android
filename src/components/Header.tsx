import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  streak: number;
  points: number;
  onHistoryPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  streak,
  points,
  onHistoryPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: theme.subText }]}>
            Focus on
          </Text>
          <Text style={[styles.title, { color: theme.text }]}>ONE THING</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.historyButton,
            { backgroundColor: theme.cardBg, borderColor: theme.border },
          ]}
          onPress={onHistoryPress}
        >
          <Text style={styles.historyIcon}>📋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.streakBg }]}>
          <Text style={styles.statIcon}>🔥</Text>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: theme.streakText }]}>
              {streak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.streakText }]}>
              day streak
            </Text>
          </View>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.pointsBg }]}>
          <Text style={styles.statIcon}>⭐</Text>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: theme.pointsText }]}>
              {points}
            </Text>
            <Text style={[styles.statLabel, { color: theme.pointsText }]}>
              points
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  historyButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  historyIcon: {
    fontSize: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
});
