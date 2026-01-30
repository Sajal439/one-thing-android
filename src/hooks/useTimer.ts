import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import {
  scheduleTimerNotification,
  cancelTimerNotification,
  showTimerEndNotification,
} from '../services/notifications';

interface TimerState {
  endTime: number | null;
  totalDuration: number | null;
}

export const useTimer = (onTimerEnd?: () => void) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasEndedRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Recalculate remaining time from stored endTime
  const syncTimerWithStorage = useCallback(async () => {
    const stored = await storage.get(STORAGE_KEYS.TIMER_END);
    if (stored) {
      const timerState: TimerState = JSON.parse(stored);
      const remaining = Math.max(
        0,
        Math.floor((timerState.endTime! - Date.now()) / 1000),
      );

      if (remaining > 0) {
        setRemainingTime(remaining);
        setTotalDuration(timerState.totalDuration);
        setTimerActive(true);
        hasEndedRef.current = false;
      } else {
        // Timer ended while in background
        await storage.remove(STORAGE_KEYS.TIMER_END);
        setTimerActive(false);
        setRemainingTime(0);
        
        if (!hasEndedRef.current) {
          hasEndedRef.current = true;
          onTimerEnd?.();
        }
      }
    }
  }, [onTimerEnd]);

  const loadTimer = useCallback(async () => {
    const stored = await storage.get(STORAGE_KEYS.TIMER_END);
    if (stored) {
      const timerState: TimerState = JSON.parse(stored);
      const remaining = Math.max(
        0,
        Math.floor((timerState.endTime! - Date.now()) / 1000),
      );

      if (remaining > 0) {
        setRemainingTime(remaining);
        setTotalDuration(timerState.totalDuration);
        setTimerActive(true);
        hasEndedRef.current = false;
      } else {
        await storage.remove(STORAGE_KEYS.TIMER_END);
        setTimerActive(false);
        setRemainingTime(0);
      }
    }
  }, []);

  useEffect(() => {
    loadTimer();
  }, [loadTimer]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // App came to foreground from background
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Recalculate timer based on stored endTime
        syncTimerWithStorage();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [syncTimerWithStorage]);

  useEffect(() => {
    if (timerActive && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearTimerInterval();
            setTimerActive(false);

            if (!hasEndedRef.current) {
              hasEndedRef.current = true;
              showTimerEndNotification();
              onTimerEnd?.();
              storage.remove(STORAGE_KEYS.TIMER_END);
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return clearTimerInterval;
    }
  }, [timerActive, clearTimerInterval, onTimerEnd]);

  const startTimer = useCallback(async (minutes: number): Promise<void> => {
    const durationInSeconds = minutes * 60;
    const endTime = Date.now() + durationInSeconds * 1000;

    const timerState: TimerState = {
      endTime,
      totalDuration: durationInSeconds,
    };

    await storage.set(STORAGE_KEYS.TIMER_END, JSON.stringify(timerState));
    await scheduleTimerNotification(minutes);

    setRemainingTime(durationInSeconds);
    setTotalDuration(durationInSeconds);
    setTimerActive(true);
    hasEndedRef.current = false;
  }, []);

  const stopTimer = useCallback(async (): Promise<void> => {
    clearTimerInterval();
    await storage.remove(STORAGE_KEYS.TIMER_END);
    await cancelTimerNotification();
    setTimerActive(false);
    setRemainingTime(0);
    setTotalDuration(null);
    hasEndedRef.current = false;
  }, [clearTimerInterval]);

  // Get elapsed time (how long the user worked)
  const getElapsedTime = useCallback((): number | null => {
    if (totalDuration === null) return null;
    return totalDuration - remainingTime;
  }, [totalDuration, remainingTime]);

  return {
    remainingTime,
    timerActive,
    totalDuration,
    startTimer,
    stopTimer,
    getElapsedTime,
  };
};
