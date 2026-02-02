import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { Theme } from '../types';
import { formatTime } from '../utils/formatters';

interface TaskContentProps {
  theme: Theme;
  task: string | null;
  input: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  timerActive: boolean;
  remainingTime: number | null;
  overtime: number;
  isOvertime: boolean;
  isStopwatch: boolean;
  shakeAnim: Animated.Value;
}

export const TaskContent: React.FC<TaskContentProps> = ({
  theme,
  task,
  input,
  onInputChange,
  // onSubmit,
  timerActive,
  remainingTime,
  overtime,
  isOvertime,
  isStopwatch,
  shakeAnim,
}) => {
  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -10, 10, -10, 0],
  });

  const getTimerColor = () => {
    if (isStopwatch) return theme.primary;
    if (isOvertime) return theme.danger;
    if (remainingTime !== null && remainingTime <= 60) return theme.danger;
    if (remainingTime !== null && remainingTime <= 300) return theme.warning;
    return theme.primary;
  };

  const getTimerBgColor = () => {
    if (isStopwatch) return theme.primaryLight;
    if (isOvertime) return theme.dangerLight;
    if (remainingTime !== null && remainingTime <= 60) return theme.dangerLight;
    if (remainingTime !== null && remainingTime <= 300)
      return theme.warningLight;
    return theme.primaryLight;
  };

  const displayTime = isStopwatch
    ? overtime
    : isOvertime
      ? overtime
      : (remainingTime ?? 0);

  const progress =
    timerActive && !isOvertime && !isStopwatch && remainingTime !== null
      ? remainingTime / (remainingTime + 1)
      : 0;

  if (task) {
    return (
      <View style={styles.taskContainer}>
        {timerActive && (
          <Animated.View
            style={[
              styles.timerCard,
              {
                backgroundColor: getTimerBgColor(),
                transform: [{ translateX: shakeInterpolate }],
              },
            ]}
          >
            <View style={styles.timerHeader}>
              <Text style={[styles.timerLabel, { color: getTimerColor() }]}>
                {isStopwatch
                  ? '⏱ Stopwatch'
                  : isOvertime
                    ? '⚠️ Overtime'
                    : '⏱ Time Remaining'}
              </Text>
            </View>
            <Text style={[styles.timerValue, { color: getTimerColor() }]}>
              {isOvertime ? '+' : ''}
              {formatTime(displayTime)}
            </Text>
            {!isStopwatch && (
              <View
                style={[styles.progressBar, { backgroundColor: theme.border }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: getTimerColor(),
                      width: `${progress * 100}%`,
                    },
                  ]}
                />
              </View>
            )}
          </Animated.View>
        )}

        <View style={[styles.taskCard, { backgroundColor: theme.cardBg }]}>
          <Text style={[styles.taskLabel, { color: theme.subText }]}>
            YOUR FOCUS
          </Text>
          <Text style={[styles.taskText, { color: theme.text }]}>{task}</Text>
        </View>

        <View style={styles.motivationContainer}>
          <Text style={[styles.motivationText, { color: theme.subText }]}>
            💪 Stay focused. You've got this!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputCard, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.inputLabel, { color: theme.subText }]}>
          What's your one thing for today?
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              color: theme.text,
              backgroundColor: theme.timerBg,
              borderColor: theme.border,
            },
          ]}
          placeholder="Enter your most important task..."
          placeholderTextColor={theme.placeholder}
          value={input}
          onChangeText={onInputChange}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          returnKeyType="done"
          blurOnSubmit
        />
        <Text style={[styles.inputHint, { color: theme.subText }]}>
          💡 Tip: Choose the task that will make the biggest impact
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  timerCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  timerHeader: {
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  timerValue: {
    fontSize: 56,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  taskCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  taskText: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  motivationContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  motivationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 100,
    lineHeight: 24,
  },
  inputHint: {
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
});
