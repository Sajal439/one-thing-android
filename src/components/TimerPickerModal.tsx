import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Theme } from '../types';

interface TimerPickerModalProps {
  visible: boolean;
  theme: Theme;
  value: string;
  onChangeValue: (value: string) => void;
  onStart: () => void;
  onSkip: () => void;
}

export const TimerPickerModal: React.FC<TimerPickerModalProps> = ({
  visible,
  theme,
  value,
  onChangeValue,
  onStart,
  onSkip,
}) => {
  const quickOptions = [15, 25, 45, 60];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.overlay, { backgroundColor: theme.overlay }]}
      >
        <View
          style={[styles.modalContainer, { backgroundColor: theme.modalBg }]}
        >
          <View style={styles.header}>
            <Text style={styles.headerIcon}>⏱</Text>
            <Text style={[styles.title, { color: theme.text }]}>
              Set a Timer
            </Text>
            <Text style={[styles.subtitle, { color: theme.subText }]}>
              Challenge yourself to complete the task in time
            </Text>
          </View>

          <View style={styles.quickOptions}>
            {quickOptions.map(mins => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.quickOption,
                  {
                    backgroundColor:
                      value === mins.toString() ? theme.primary : theme.timerBg,
                    borderColor:
                      value === mins.toString() ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => onChangeValue(mins.toString())}
              >
                <Text
                  style={[
                    styles.quickOptionText,
                    {
                      color: value === mins.toString() ? '#FFFFFF' : theme.text,
                    },
                  ]}
                >
                  {mins}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customInputContainer}>
            <Text style={[styles.orText, { color: theme.subText }]}>
              or enter custom time
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.timerBg,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="00"
                placeholderTextColor={theme.placeholder}
                keyboardType="number-pad"
                value={value}
                onChangeText={onChangeValue}
                maxLength={3}
              />
              <Text style={[styles.minutesLabel, { color: theme.subText }]}>
                minutes
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: theme.primary }]}
              onPress={onStart}
            >
              <Text style={styles.startButtonText}>Start Timer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={[styles.skipButtonText, { color: theme.subText }]}>
                Skip, I'll work without a timer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  quickOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  quickOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customInputContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  orText: {
    fontSize: 13,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    width: 80,
    height: 56,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  minutesLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    gap: 12,
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
