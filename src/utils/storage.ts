import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.log(`Failed to get ${key}`, e);
      return null;
    }
  },

  set: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.log(`Failed to set ${key}`, e);
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log(`Failed to remove ${key}`, e);
    }
  },
};
