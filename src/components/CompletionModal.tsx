import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme, ModalType } from '../types';

interface CompletionModalProps {
  visible: boolean;
  theme: Theme;
  type: ModalType;
  pointsEarned: number;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  theme,
  type,
  pointsEarned,
  onClose,
}) => {
  const isSuccess = type === 'success';

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.modalBg }]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isSuccess
                  ? theme.successLight
                  : theme.dangerLight,
              },
            ]}
          >
            <Text style={styles.icon}>{isSuccess ? '🎉' : '⏰'}</Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {isSuccess ? 'Amazing Work!' : "Time's Up!"}
          </Text>

          <Text style={[styles.message, { color: theme.subText }]}>
            {isSuccess
              ? 'You completed your focus task. Keep building that momentum!'
              : "Don't worry, every attempt builds discipline. Try again!"}
          </Text>

          {isSuccess && pointsEarned > 0 && (
            <View
              style={[styles.pointsCard, { backgroundColor: theme.pointsBg }]}
            >
              <Text style={styles.pointsIcon}>⭐</Text>
              <Text style={[styles.pointsValue, { color: theme.pointsText }]}>
                +{pointsEarned}
              </Text>
              <Text style={[styles.pointsLabel, { color: theme.pointsText }]}>
                points earned
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isSuccess ? theme.success : theme.primary,
              },
            ]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>
              {isSuccess ? 'Continue' : 'Try Again'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    gap: 8,
  },
  pointsIcon: {
    fontSize: 24,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
