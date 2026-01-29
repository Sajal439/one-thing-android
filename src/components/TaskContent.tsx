import React from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { Theme } from '../types';
import { formatTime } from '../utils/formatters';

interface Props {
  theme: Theme;
  task: string;
  input: string;
  onInputChange: (text: string) => void;
  onSubmit: () => void;
  timerActive: boolean;
  remainingTime: number;
  shakeAnim: Animated.Value;
}

export const TaskContent: React.FC<Props> = ({
  theme,
  task,
  input,
  onInputChange,
  onSubmit,
  timerActive,
  remainingTime,
  shakeAnim,
}) => {
  const getTimerColor = (): string => {
    if (remainingTime <= 300) return theme.danger;
    if (remainingTime <= 600) return theme.warning;
    return theme.success;
  };

  return (
    <Animated.View
      style={[styles.content, { transform: [{ translateX: shakeAnim }] }]}
    >
      {task ? (
        <>
          <Text style={[styles.label, { color: theme.subText }]}>
            This is what you chose
          </Text>
          <Text style={[styles.task, { color: theme.text }]}>{task}</Text>

          {timerActive && (
            <View
              style={[
                styles.timerContainer,
                { backgroundColor: theme.timerBg },
              ]}
            >
              <Text style={[styles.timerLabel, { color: theme.subText }]}>
                Time Remaining
              </Text>
              <Text style={[styles.timerText, { color: getTimerColor() }]}>
                {formatTime(remainingTime)}
              </Text>
            </View>
          )}
        </>
      ) : (
        <>
          <Text style={[styles.emptyHint, { color: theme.subText }]}>
            Choose carefully. You only get one.
          </Text>
          <TextInput
            placeholder="What are you avoiding?"
            placeholderTextColor={theme.subText}
            value={input}
            onChangeText={onInputChange}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.inputBorder },
            ]}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    opacity: 0.5,
    marginBottom: 6,
  },
  task: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 38,
  },
  emptyHint: {
    fontSize: 14,
    opacity: 0.4,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    fontSize: 20,
    borderBottomWidth: 1,
    paddingVertical: 8,
    textAlign: 'center',
  },
  timerContainer: {
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
