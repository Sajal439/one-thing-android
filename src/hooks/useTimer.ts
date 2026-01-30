import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import {
  scheduleTimerNotification,
  cancelTimerNotification,
} from '../services/notifications';

interface UseTimerReturn {
  remainingTime: number;
  timerActive: boolean;
  startTimer: (minutes: number) => Promise<void>;
  stopTimer: () => Promise<void>;
}

export const useTimer = (onTimerEnd?: () => void): UseTimerReturn => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const onTimerEndRef = useRef(onTimerEnd);

  // Keep the callback ref updated
  useEffect(() => {
    onTimerEndRef.current = onTimerEnd;
  }, [onTimerEnd]);

  // Calculate remaining time from stored end time
  const calculateRemainingTime = useCallback(async (): Promise<number> => {
    const endTimeStr = await storage.get(STORAGE_KEYS.TIMER_END);
    if (!endTimeStr) return 0;

    const endTime = parseInt(endTimeStr, 10);
    endTimeRef.current = endTime;
    const remaining = Math.floor((endTime - Date.now()) / 1000);
    return Math.max(0, remaining);
  }, []);

  // Load timer on mount
  useEffect(() => {
    const loadTimer = async () => {
      const remaining = await calculateRemainingTime();
      if (remaining > 0) {
        setRemainingTime(remaining);
        setTimerActive(true);
      } else {
        const endTimeStr = await storage.get(STORAGE_KEYS.TIMER_END);
        if (endTimeStr) {
          // Timer expired while app was closed
          await storage.remove(STORAGE_KEYS.TIMER_END);
          onTimerEndRef.current?.();
        }
      }
    };
    loadTimer();
  }, [calculateRemainingTime]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && endTimeRef.current) {
        // App came to foreground - recalculate time
        const remaining = await calculateRemainingTime();

        if (remaining <= 0) {
          // Timer expired while in background
          setTimerActive(false);
          setRemainingTime(0);
          await storage.remove(STORAGE_KEYS.TIMER_END);
          endTimeRef.current = null;
          onTimerEndRef.current?.();
        } else {
          setRemainingTime(remaining);
          setTimerActive(true);
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [calculateRemainingTime]);

  // Countdown effect - uses end time for accuracy
  useEffect(() => {
    if (!timerActive || !endTimeRef.current) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor((endTimeRef.current! - now) / 1000);

      if (remaining <= 0) {
        setTimerActive(false);
        setRemainingTime(0);
        storage.remove(STORAGE_KEYS.TIMER_END);
        endTimeRef.current = null;
        onTimerEndRef.current?.();
        clearInterval(interval);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const startTimer = useCallback(async (minutes: number): Promise<void> => {
    const endTime = Date.now() + minutes * 60 * 1000;
    await storage.set(STORAGE_KEYS.TIMER_END, endTime.toString());
    endTimeRef.current = endTime;
    setRemainingTime(minutes * 60);
    setTimerActive(true);
    await scheduleTimerNotification(minutes);
  }, []);

  const stopTimer = useCallback(async (): Promise<void> => {
    await storage.remove(STORAGE_KEYS.TIMER_END);
    await cancelTimerNotification();
    endTimeRef.current = null;
    setTimerActive(false);
    setRemainingTime(0);
  }, []);

  return { remainingTime, timerActive, startTimer, stopTimer };
};
