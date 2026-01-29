import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Theme, ModalType } from '../types';

interface Props {
  visible: boolean;
  theme: Theme;
  type: ModalType;
  pointsEarned: number;
  onClose: () => void;
}

export const CompletionModal: React.FC<Props> = ({
  visible,
  theme,
  type,
  pointsEarned,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
      <View style={[styles.box, { backgroundColor: theme.modalBg }]}>
        {type === 'success' ? (
          <>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={[styles.text, { color: theme.text }]}>
              That wasn't so bad!
            </Text>
            <Text style={[styles.points, { color: theme.success }]}>
              +{pointsEarned} points earned!
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.emoji}>⏰</Text>
            <Text style={[styles.text, { color: theme.text }]}>Time's up!</Text>
            <Text style={[styles.subtext, { color: theme.subText }]}>
              Don't give up - you can still complete your task.
            </Text>
          </>
        )}

        <Pressable
          style={[
            styles.btn,
            {
              backgroundColor:
                type === 'success' ? theme.success : theme.primary,
            },
          ]}
          onPress={onClose}
        >
          <Text style={styles.btnText}>Continue</Text>
        </Pressable>
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
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  points: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
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
});
