import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal } from 'react-native';
import notifee, {
  AndroidImportance,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';
const createChannel = async () => {
  await notifee.createChannel({
    id: 'daily-reminder',
    name: 'Daily Reminder',
    importance: AndroidImportance.DEFAULT,
  });
};
const scheduleDailyReminder = async () => {
  await createChannel();

  await notifee.cancelAllNotifications();

  const date = new Date();
  date.setHours(21); // 9 PM
  date.setMinutes(0);
  date.setSeconds(0);

  if (date.getTime() < Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  await notifee.createTriggerNotification(
    {
      title: 'ONE THING',
      body: 'You still owe yourself one thing.',
      android: {
        channelId: 'daily-reminder',
        smallIcon: 'ic_launcher',
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    },
  );
};
const initNotifications = async () => {
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= 1) {
    await scheduleDailyReminder();
  }
};

const STREAK_KEY = 'STREAK_COUNT';
const LAST_DATE_KEY = 'LAST_COMPLETED_DATE';
const STORAGE_KEY = 'ONE_TASK';
const colors = {
  light: {
    background: '#ffffff',
    text: '#000000',
    subText: 'rgba(0,0,0,0.5)',
    inputBorder: '#cccccc',
    primary: '#2563eb',
    success: '#16a34a',
    modalBg: '#ffffff',
    overlay: 'rgba(0,0,0,0.4)',
  },
  dark: {
    background: '#0f172a',
    text: '#f8fafc',
    subText: 'rgba(248, 250, 252, 0.8)',
    inputBorder: '#475569',
    primary: '#3b82f6',
    success: '#22c55e',
    modalBg: '#020617',
    overlay: 'rgba(0,0,0,0.6)',
  },
};

const App = () => {
  const [task, setTask] = useState('');
  const [input, setInput] = useState('');
  const [streak, setStreak] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const scheme = useColorScheme(); // "light" | "dark"
  const isDark = scheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  useEffect(() => {
    loadTask();
    loadStreak();
    initNotifications();
  });
  const getToday = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const daysBetween = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = d2.getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const loadStreak = async (): Promise<void> => {
    try {
      const savedStreak = await AsyncStorage.getItem(STREAK_KEY);
      const lastDate = await AsyncStorage.getItem(LAST_DATE_KEY);

      if (!savedStreak || !lastDate) {
        setStreak(0);
        return;
      }

      const today = getToday();
      const gap = daysBetween(lastDate, today);

      if (gap > 1) {
        // streak broken
        await AsyncStorage.setItem(STREAK_KEY, '0');
        setStreak(0);
      } else {
        setStreak(Number(savedStreak));
      }
    } catch (e) {
      console.log('Failed to load/reset streak', e);
    }
  };

  const loadTask = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) setTask(saved);
  };

  const saveTask = async () => {
    if (!input.trim()) return;
    await AsyncStorage.setItem(STORAGE_KEY, input);
    setTask(input);
    setInput('');
  };
  const clearTask = async (): Promise<void> => {
    try {
      const today = getToday();
      const lastDate = await AsyncStorage.getItem(LAST_DATE_KEY);

      let newStreak = streak;

      if (lastDate !== today) {
        newStreak = streak + 1;
        await AsyncStorage.setItem(STREAK_KEY, newStreak.toString());
        await AsyncStorage.setItem(LAST_DATE_KEY, today);
        setStreak(newStreak);
      }

      await AsyncStorage.removeItem(STORAGE_KEY);
      setTask('');

      // SHOW COMPLETION MODAL
      setShowModal(true);
    } catch (e) {
      console.log('Failed to clear task / update streak', e);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <Text style={[styles.title, { color: theme.text }]}>ONE THING</Text>
      <Text style={[styles.streak, { color: theme.subText }]}>
        🔥 {streak} day streak
      </Text>
      {/* MAIN CONTENT */}
      <View style={styles.content}>
        {task ? (
          <>
            <Text style={[styles.label, { color: theme.subText }]}>
              This is what you chose
            </Text>
            <Text style={[styles.task, { color: theme.text }]}>{task}</Text>
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
              onChangeText={setInput}
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.inputBorder },
              ]}
              returnKeyType="done"
              onSubmitEditing={saveTask}
            />
          </>
        )}
      </View>

      {/* FOOTER ACTION */}
      <View style={styles.footer}>
        {task ? (
          <Pressable
            style={({ pressed }) => [
              styles.doneBtn,
              { backgroundColor: theme.success },
              pressed && { opacity: 0.8 },
            ]}
            onPress={clearTask}
          >
            <Text style={[styles.btnText, { color: theme.text }]}>
              I Did it
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.commitBtn,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.85 },
            ]}
            onPress={saveTask}
          >
            <Text style={[styles.btnText, { color: theme.text }]}>
              Lock it in
            </Text>
          </Pressable>
        )}
      </View>
      <Modal visible={showModal} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalBox, { backgroundColor: theme.modalBg }]}>
            <Text style={[styles.modalText, { color: theme.text }]}>
              That wasn’t so bad.
            </Text>

            <Pressable
              style={styles.modalBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalBtnText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },

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

  input: {
    width: '100%',
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    textAlign: 'center',
  },

  footer: {
    width: '100%',
  },

  commitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  doneBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 14,
    opacity: 0.4,
    marginBottom: 12,
    textAlign: 'center',
  },
  streak: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 14,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: '80%',
    alignItems: 'center',
  },

  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },

  modalBtn: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  modalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
