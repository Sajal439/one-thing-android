import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const usePoints = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const loadPoints = async () => {
      const savedPoints = await storage.get(STORAGE_KEYS.POINTS);
      if (savedPoints) setPoints(Number(savedPoints));
    };
    loadPoints();
  }, []);

  const addPoints = useCallback(
    async (earned: number): Promise<number> => {
      const newPoints = points + earned;
      await storage.set(STORAGE_KEYS.POINTS, newPoints.toString());
      setPoints(newPoints);
      return newPoints;
    },
    [points],
  );

  return { points, addPoints };
};
