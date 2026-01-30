import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../types';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const stored = await storage.get(STORAGE_KEYS.HISTORY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const addToHistory = useCallback(
    async (
      task: string,
      duration: number | null,
      pointsEarned: number,
    ): Promise<void> => {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        task,
        completedAt: new Date().toISOString(),
        duration,
        pointsEarned,
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      await storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    },
    [history],
  );

  const deleteFromHistory = useCallback(
    async (id: string): Promise<void> => {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      await storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    },
    [history],
  );

  const clearHistory = useCallback(async (): Promise<void> => {
    setHistory([]);
    await storage.set(STORAGE_KEYS.HISTORY, JSON.stringify([]));
  }, []);

  return {
    history,
    addToHistory,
    deleteFromHistory,
    clearHistory,
  };
};
