import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Theme } from '../types';

interface Props {
  visible: boolean;
  theme: Theme;
  value: string;
  onChangeValue: (text: string) => void;
  onStart: () => void;
  onSkip: () => void;
}

export const TimerPickerModal: React.FC<Props> = ({
  visible,
  theme,
  value,
  onChangeValue,
  onStart,
  onSkip,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
      <View style={[styles.box, { backgroundColor: theme.modalBg }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          ⏱️ Set a Timer
        </Text>
        <Text style={[styles.subtext, { color: theme.subText }]}>
          Challenge yourself! Complete before time runs out for bonus points.
        </Text>

        <TextInput
          placeholder="Minutes (e.g., 30)"
          placeholderTextColor={theme.subText}
          value={value}
          onChangeText={onChangeValue}
          keyboardType="numeric"
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.inputBorder },
          ]}
        />

        <View style={styles.btnRow}>
          <Pressable
            style={[styles.btnSecondary, { borderColor: theme.inputBorder }]}
            onPress={onSkip}
          >
            <Text style={[styles.btnSecondaryText, { color: theme.text }]}>
              Skip
            </Text>
          </Pressable>

          <Pressable
            style={[styles.btn, { backgroundColor: theme.primary }]}
            onPress={onStart}
          >
            <Text style={styles.btnText}>Start Timer</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  input: {
    width: '100%',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
