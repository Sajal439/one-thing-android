import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getToday, daysBetween } from '../utils/dateUtils';

export const useStreak = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const loadStreak = async () => {
      const savedStreak = await storage.get(STORAGE_KEYS.STREAK);
      const lastDate = await storage.get(STORAGE_KEYS.LAST_DATE);

      if (!savedStreak || !lastDate) {
        setStreak(0);
        return;
      }

      const today = getToday();
      const gap = daysBetween(lastDate, today);

      if (gap > 1) {
        await storage.set(STORAGE_KEYS.STREAK, '0');
        setStreak(0);
      } else {
        setStreak(Number(savedStreak));
      }
    };
    loadStreak();
  }, []);

  const incrementStreak = useCallback(async (): Promise<number> => {
    const today = getToday();
    const lastDate = await storage.get(STORAGE_KEYS.LAST_DATE);

    if (lastDate !== today) {
      const newStreak = streak + 1;
      await storage.set(STORAGE_KEYS.STREAK, newStreak.toString());
      await storage.set(STORAGE_KEYS.LAST_DATE, today);
      setStreak(newStreak);
      return newStreak;
    }
    return streak;
  }, [streak]);

  return { streak, incrementStreak };
};
