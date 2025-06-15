// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lot } from '../types';

const TICKETS_STORAGE_KEY = 'bingo_tickets_data';
const DRAWN_NUMBERS_KEY = 'bingo_drawn_numbers';

export const saveTickets = async (lots: Lot[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(lots);
    await AsyncStorage.setItem(TICKETS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving tickets to storage:', e);
  }
};

export const loadTickets = async (): Promise<Lot[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TICKETS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading tickets from storage:', e);
    return null;
  }
};

export const saveDrawnNumbers = async (numbers: number[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(numbers);
    await AsyncStorage.setItem(DRAWN_NUMBERS_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving drawn numbers to storage:', e);
  }
};

export const loadDrawnNumbers = async (): Promise<number[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DRAWN_NUMBERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading drawn numbers from storage:', e);
    return null;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TICKETS_STORAGE_KEY);
    await AsyncStorage.removeItem(DRAWN_NUMBERS_KEY);
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
};