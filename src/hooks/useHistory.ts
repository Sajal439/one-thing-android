import { useState, useEffect, useCallback, useMemo } from 'react';
import { HistoryItem } from '../types';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // PERF: Load history only once on mount
  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        const stored = await storage.get(STORAGE_KEYS.HISTORY);
        if (isMounted && stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Error parsing history:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // PERF: Memoize sorted history to avoid recalculating on every render
  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  }, [history]);

  const addToHistory = useCallback(
    async (
      task: string,
      duration: number | null,
      pointsEarned: number,
    ): Promise<void> => {
      try {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          task,
          completedAt: new Date().toISOString(),
          duration,
          pointsEarned,
        };
        const updatedHistory = [newItem, ...history];
        await storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } catch (error) {
        console.warn('Error adding to history:', error);
      }
    },
    [history],
  );

  const deleteFromHistory = useCallback(
    async (id: string) => {
      try {
        const updatedHistory = history.filter(item => item.id !== id);
        await storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } catch (error) {
        console.warn('Error deleting from history:', error);
      }
    },
    [history],
  );

  const clearHistory = useCallback(async () => {
    try {
      await storage.remove(STORAGE_KEYS.HISTORY);
      setHistory([]);
    } catch (error) {
      console.warn('Error clearing history:', error);
    }
  }, []);

  return {
    history: sortedHistory,
    isLoading,
    addToHistory,
    deleteFromHistory,
    clearHistory,
  };
};
