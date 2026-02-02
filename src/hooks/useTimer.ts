import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useTimer = (onTimerEnd?: () => void) => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number | null>(null);
  const [overtime, setOvertime] = useState<number>(0);
  const [isOvertime, setIsOvertime] = useState(false);
  const [isStopwatch, setIsStopwatch] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCalledOnEnd = useRef(false);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopTimer = useCallback(async () => {
    clearTimerInterval();
    setTimerActive(false);
    setRemainingTime(null);
    setTotalDuration(null);
    setOvertime(0);
    setIsOvertime(false);
    setIsStopwatch(false);
    hasCalledOnEnd.current = false;
    await AsyncStorage.removeItem(STORAGE_KEYS.TIMER_END);
    await AsyncStorage.removeItem(STORAGE_KEYS.TIMER_DURATION);
  }, [clearTimerInterval]);

  const startTimer = useCallback(async (minutes: number) => {
    const durationSeconds = minutes * 60;
    const endTime = Date.now() + durationSeconds * 1000;

    await AsyncStorage.setItem(STORAGE_KEYS.TIMER_END, endTime.toString());
    await AsyncStorage.setItem(
      STORAGE_KEYS.TIMER_DURATION,
      durationSeconds.toString(),
    );

    setTotalDuration(durationSeconds);
    setRemainingTime(durationSeconds);
    setTimerActive(true);
    setOvertime(0);
    setIsOvertime(false);
    setIsStopwatch(false);
    hasCalledOnEnd.current = false;
  }, []);

  const startStopwatch = useCallback(async () => {
    clearTimerInterval();
    await AsyncStorage.removeItem(STORAGE_KEYS.TIMER_END);
    await AsyncStorage.removeItem(STORAGE_KEYS.TIMER_DURATION);

    setTotalDuration(null);
    setRemainingTime(null);
    setOvertime(0);
    setIsOvertime(false);
    setIsStopwatch(true);
    setTimerActive(true);
    hasCalledOnEnd.current = false;
  }, [clearTimerInterval]);

  const getElapsedTime = useCallback((): number | null => {
    if (isStopwatch) {
      return overtime;
    }
    if (totalDuration === null) return null;
    if (isOvertime) {
      return totalDuration + overtime;
    }
    if (remainingTime === null) return null;
    return totalDuration - remainingTime;
  }, [totalDuration, remainingTime, isOvertime, overtime, isStopwatch]);

  useEffect(() => {
    const loadTimer = async () => {
      const endTimeStr = await AsyncStorage.getItem(STORAGE_KEYS.TIMER_END);
      const durationStr = await AsyncStorage.getItem(
        STORAGE_KEYS.TIMER_DURATION,
      );

      if (endTimeStr && durationStr) {
        const endTime = parseInt(endTimeStr, 10);
        const duration = parseInt(durationStr, 10);
        const now = Date.now();
        const remaining = Math.floor((endTime - now) / 1000);

        setTotalDuration(duration);
        setIsStopwatch(false);

        if (remaining > 0) {
          setRemainingTime(remaining);
          setTimerActive(true);
        } else {
          // Timer has expired, calculate overtime
          const overtimeSeconds = Math.abs(remaining);
          setRemainingTime(0);
          setOvertime(overtimeSeconds);
          setIsOvertime(true);
          setTimerActive(true);
        }
      }
    };
    loadTimer();
  }, []);

  useEffect(() => {
    if (!timerActive) {
      clearTimerInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isStopwatch) {
        setOvertime(prev => prev + 1);
      } else if (isOvertime) {
        // Count up overtime
        setOvertime(prev => prev + 1);
      } else if (remainingTime !== null) {
        if (remainingTime <= 1) {
          // Timer just expired, switch to overtime mode
          setRemainingTime(0);
          setIsOvertime(true);
          setOvertime(0);
          if (!hasCalledOnEnd.current && onTimerEnd) {
            hasCalledOnEnd.current = true;
            onTimerEnd();
          }
        } else {
          setRemainingTime(prev => (prev !== null ? prev - 1 : null));
        }
      }
    }, 1000);

    return () => clearTimerInterval();
  }, [timerActive, remainingTime, isOvertime, isStopwatch, onTimerEnd, clearTimerInterval]);

  return {
    remainingTime,
    timerActive,
    totalDuration,
    overtime,
    isOvertime,
    isStopwatch,
    startTimer,
    startStopwatch,
    stopTimer,
    getElapsedTime,
  };
};
