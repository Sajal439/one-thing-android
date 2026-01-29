import { useState, useEffect, useCallback } from 'react';
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
  onTimerEnd?: () => void;
}

export const useTimer = (onTimerEnd?: () => void): UseTimerReturn => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Load timer on mount
  useEffect(() => {
    const loadTimer = async () => {
      const endTime = await storage.get(STORAGE_KEYS.TIMER_END);
      if (endTime) {
        const remaining = Math.floor(
          (parseInt(endTime, 10) - Date.now()) / 1000,
        );
        if (remaining > 0) {
          setRemainingTime(remaining);
          setTimerActive(true);
        } else {
          await storage.remove(STORAGE_KEYS.TIMER_END);
        }
      }
    };
    loadTimer();
  }, []);

  // Countdown effect
  useEffect(() => {
    if (!timerActive || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          onTimerEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, remainingTime, onTimerEnd]);

  const startTimer = useCallback(async (minutes: number): Promise<void> => {
    const endTime = Date.now() + minutes * 60 * 1000;
    await storage.set(STORAGE_KEYS.TIMER_END, endTime.toString());
    setRemainingTime(minutes * 60);
    setTimerActive(true);
    await scheduleTimerNotification(minutes);
  }, []);

  const stopTimer = useCallback(async (): Promise<void> => {
    await storage.remove(STORAGE_KEYS.TIMER_END);
    await cancelTimerNotification();
    setTimerActive(false);
    setRemainingTime(0);
  }, []);

  return { remainingTime, timerActive, startTimer, stopTimer };
};
