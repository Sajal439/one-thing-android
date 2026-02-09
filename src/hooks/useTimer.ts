import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
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
  const AppStateRef = useRef<AppStateStatus>('active');

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
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TIMER_END),
        AsyncStorage.removeItem(STORAGE_KEYS.TIMER_DURATION),
        AsyncStorage.removeItem('TIMER_START'),
        AsyncStorage.removeItem('STOPWATCH_START'),
      ]);
    } catch (error) {
      console.warn('Error clearing timer storage:', error);
    }
  }, [clearTimerInterval]);

  const startTimer = useCallback(async (minutes: number) => {
    const durationSeconds = minutes * 60;
    const startTime = Date.now();
    const endTime = startTime + durationSeconds * 1000;

    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TIMER_END, endTime.toString()),
        AsyncStorage.setItem(
          STORAGE_KEYS.TIMER_DURATION,
          durationSeconds.toString(),
        ),
        AsyncStorage.setItem('TIMER_START', startTime.toString()),
      ]);
    } catch (error) {
      console.warn('Error saving timer:', error);
      return;
    }

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
    const stopwatchStart = Date.now();
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.TIMER_END),
        AsyncStorage.removeItem(STORAGE_KEYS.TIMER_DURATION),
        AsyncStorage.setItem('STOPWATCH_START', stopwatchStart.toString()),
      ]);
    } catch (error) {
      console.warn('Error starting stopwatch:', error);
      return;
    }

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
    let isMounted = true;
    const loadTimer = async () => {
      try {
        const [endTimeStr, durationStr, stopwatchStartStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TIMER_END),
          AsyncStorage.getItem(STORAGE_KEYS.TIMER_DURATION),
          AsyncStorage.getItem('STOPWATCH_START'),
        ]);
        if (!isMounted) return;
        if (stopwatchStartStr) {
          const stopwatchStart = parseInt(stopwatchStartStr, 10);
          const elapsed = Math.floor((Date.now() - stopwatchStart) / 1000);
          setOvertime(elapsed);
          setIsStopwatch(true);
          setTimerActive(true);
          setTotalDuration(null);
          setRemainingTime(null);
          return;
        }
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
            setRemainingTime(0);
            setOvertime(Math.abs(remaining));
            setIsOvertime(true);
            setTimerActive(true);
          }
        }
      } catch (error) {
        console.warn('Error loading timer from storage:', error);
      }
    };
    loadTimer();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!timerActive) {
      clearTimerInterval();
      return;
    }

    const subscription = AppState.addEventListener('change', async state => {
      AppStateRef.current = state;

      if (state === 'active') {
        try {
          // PERF: Batch reads
          const [endTimeStr, durationStr, stopwatchStartStr] =
            await Promise.all([
              AsyncStorage.getItem(STORAGE_KEYS.TIMER_END),
              AsyncStorage.getItem(STORAGE_KEYS.TIMER_DURATION),
              AsyncStorage.getItem('STOPWATCH_START'),
            ]);

          if (stopwatchStartStr) {
            const stopwatchStart = parseInt(stopwatchStartStr, 10);
            const elapsed = Math.floor((Date.now() - stopwatchStart) / 1000);
            setOvertime(elapsed);
            setIsStopwatch(true);
          } else if (endTimeStr && durationStr) {
            const endTime = parseInt(endTimeStr, 10);
            const duration = parseInt(durationStr, 10);
            const now = Date.now();
            const remaining = Math.floor((endTime - now) / 1000);

            setTotalDuration(duration);

            if (remaining > 0) {
              setRemainingTime(remaining);
              setIsOvertime(false);
            } else {
              setRemainingTime(0);
              setOvertime(Math.abs(remaining));
              setIsOvertime(true);
            }
          }
        } catch (error) {
          console.warn('Error recalculating timer on foreground:', error);
        }
      }
    });

    intervalRef.current = setInterval(() => {
      if (isStopwatch) {
        setOvertime(prev => prev + 1);
      } else if (isOvertime) {
        setOvertime(prev => prev + 1);
      } else if (remainingTime !== null && remainingTime > 0) {
        setRemainingTime(prev => {
          const newTime = (prev ?? 0) - 1;
          if (newTime <= 0) {
            setRemainingTime(0);
            setIsOvertime(true);
            setOvertime(0);
            if (!hasCalledOnEnd.current && onTimerEnd) {
              hasCalledOnEnd.current = true;
              onTimerEnd();
            }
          }
          return newTime;
        });
      }
    }, 1000);

    return () => {
      clearTimerInterval();
      subscription.remove();
    };
  }, [
    timerActive,
    isStopwatch,
    isOvertime,
    remainingTime,
    onTimerEnd,
    clearTimerInterval,
  ]);

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
