import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Theme, HistoryItem } from '../types';

interface HistoryModalProps {
  visible: boolean;
  theme: Theme;
  history: HistoryItem[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return 'No timer';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } else if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  theme,
  history,
  onClose,
  onDelete,
  onClearAll,
}) => {
  const handleDelete = (item: HistoryItem) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${item.task}" from history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: onClearAll,
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={[styles.historyItem, { backgroundColor: theme.timerBg }]}>
      <View style={styles.itemContent}>
        <Text style={[styles.taskText, { color: theme.text }]} numberOfLines={2}>
          {item.task}
        </Text>
        <View style={styles.itemDetails}>
          <Text style={[styles.detailText, { color: theme.subText }]}>
            {formatDate(item.completedAt)}
          </Text>
          <Text style={[styles.detailText, { color: theme.subText }]}>
            ⏱ {formatDuration(item.duration)}
          </Text>
          <Text style={[styles.pointsText, { color: theme.success }]}>
            +{item.pointsEarned} pts
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Text style={[styles.deleteText, { color: theme.danger }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.subText }]}>
        No completed tasks yet.
      </Text>
      <Text style={[styles.emptySubText, { color: theme.subText }]}>
        Complete your first task to see it here!
      </Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: theme.modalBg }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>📋 History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {history.length > 0 && (
            <TouchableOpacity
              style={[styles.clearAllButton, { borderColor: theme.danger }]}
              onPress={handleClearAll}
            >
              <Text style={[styles.clearAllText, { color: theme.danger }]}>
                Clear All History
              </Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={history.length === 0 ? styles.emptyList : undefined}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearAllButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailText: {
    fontSize: 13,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyList: {
    flex: 1,
  },
});
