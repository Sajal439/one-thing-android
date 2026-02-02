import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useTask = () => {
  const [task, setTask] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // PERF: Load task only once on mount
  useEffect(() => {
    let isMounted = true;

    const loadTask = async () => {
      try {
        const saved = await storage.get(STORAGE_KEYS.TASK);
        if (isMounted) {
          setTask(saved);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Error loading task:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTask();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveTask = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return false;

    try {
      await storage.set(STORAGE_KEYS.TASK, trimmed);
      setTask(trimmed);
      setInput('');
      return true;
    } catch (error) {
      console.warn('Error saving task:', error);
      return false;
    }
  }, [input]);

  const clearTask = useCallback(async () => {
    try {
      await storage.remove(STORAGE_KEYS.TASK);
      setTask(null);
      setInput('');
    } catch (error) {
      console.warn('Error clearing task:', error);
    }
  }, []);

  return {
    task,
    input,
    setInput,
    isLoading,
    saveTask,
    clearTask,
  };
};
