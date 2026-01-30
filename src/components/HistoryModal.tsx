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
    return `Today, ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString([], {
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
    Alert.alert('Delete Task', `Remove "${item.task}" from history?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(item.id),
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'This will permanently delete all your history. Continue?',
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

  const totalPoints = history.reduce((sum, item) => sum + item.pointsEarned, 0);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={[styles.historyItem, { backgroundColor: theme.cardBg }]}>
      <View style={styles.itemContent}>
        <Text
          style={[styles.taskText, { color: theme.text }]}
          numberOfLines={2}
        >
          {item.task}
        </Text>
        <View style={styles.itemMeta}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaIcon]}>📅</Text>
            <Text style={[styles.metaText, { color: theme.subText }]}>
              {formatDate(item.completedAt)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaIcon]}>⏱</Text>
            <Text style={[styles.metaText, { color: theme.subText }]}>
              {formatDuration(item.duration)}
            </Text>
          </View>
          <View
            style={[styles.pointsBadge, { backgroundColor: theme.pointsBg }]}
          >
            <Text style={[styles.pointsBadgeText, { color: theme.pointsText }]}>
              +{item.pointsEarned}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: theme.dangerLight }]}
        onPress={() => handleDelete(item)}
      >
        <Text style={[styles.deleteText, { color: theme.danger }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={[styles.emptyText, { color: theme.text }]}>
        No history yet
      </Text>
      <Text style={[styles.emptySubText, { color: theme.subText }]}>
        Complete your first task to start tracking your progress!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.statsHeader}>
      <View style={[styles.statBox, { backgroundColor: theme.primaryLight }]}>
        <Text style={[styles.statBoxValue, { color: theme.primary }]}>
          {history.length}
        </Text>
        <Text style={[styles.statBoxLabel, { color: theme.primary }]}>
          Tasks Completed
        </Text>
      </View>
      <View style={[styles.statBox, { backgroundColor: theme.pointsBg }]}>
        <Text style={[styles.statBoxValue, { color: theme.pointsText }]}>
          {totalPoints}
        </Text>
        <Text style={[styles.statBoxLabel, { color: theme.pointsText }]}>
          Total Points
        </Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.title, { color: theme.text }]}>History</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>
                Your completed tasks
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.cardBg }]}
              onPress={onClose}
            >
              <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {history.length > 0 && renderHeader()}

          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={[
              styles.listContent,
              history.length === 0 && styles.emptyList,
            ]}
            showsVerticalScrollIndicator={false}
          />

          {history.length > 0 && (
            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.clearAllButton, { borderColor: theme.danger }]}
                onPress={handleClearAll}
              >
                <Text style={[styles.clearAllText, { color: theme.danger }]}>
                  Clear All History
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    height: '85%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statBoxLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  itemContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 22,
  },
  itemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 13,
  },
  pointsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  clearAllButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
