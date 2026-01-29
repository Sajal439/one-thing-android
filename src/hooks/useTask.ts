import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const useTask = () => {
  const [task, setTask] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      const saved = await storage.get(STORAGE_KEYS.TASK);
      if (saved) setTask(saved);
    };
    loadTask();
  }, []);

  const saveTask = useCallback(async (): Promise<boolean> => {
    if (!input.trim()) return false;
    await storage.set(STORAGE_KEYS.TASK, input);
    setTask(input);
    setInput('');
    return true;
  }, [input]);

  const clearTask = useCallback(async (): Promise<void> => {
    await storage.remove(STORAGE_KEYS.TASK);
    setTask('');
  }, []);

  return { task, input, setInput, saveTask, clearTask };
};
