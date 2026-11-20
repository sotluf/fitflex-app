import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userStore } from './UserStore';
import { formatDateISO } from '../utils/helpers';

export type FitnessPreferences = {
  goal: string;
  level: string;
  gender: string;
  weight: number;
  height: number;
  targetWeight?: number;
};

export type WeightRecord = {
  date: string;
  weight: number;
};

export type PhotoRecord = {
  id: string;
  date: string;
  uri: string;
};

export type HistoryItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  duration: string;
  distance?: string;
  notes?: string;
};

const PREFERENCES = 'fitness_preferences';
const WEIGHTS = 'fitness_weight_history';
const PHOTOS = 'fitness_photo_history';
const WORKOUTS = 'workout_history';

async function readData(key: string, email: string) {
  const json = await AsyncStorage.getItem(`${key}:${email}`);
  return json ? JSON.parse(json) : null;
}

function saveData(key: string, data: object) {
  return AsyncStorage.setItem(
    `${key}:${userStore.userProfile?.email}`,
    JSON.stringify(data),
  );
}

class FitnessStore {
  preferences: FitnessPreferences | null = null;
  weightHistory: WeightRecord[] = [];
  photoHistory: PhotoRecord[] = [];
  historyRecords: HistoryItem[] = [];
  loadedEmail: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isQuizCompleted() {
    return this.preferences !== null;
  }

  get currentWeight() {
    const last = this.weightHistory[this.weightHistory.length - 1];
    return last ? last.weight : this.preferences?.weight || 0;
  }

  get targetWeight() {
    return this.preferences?.targetWeight || this.currentWeight;
  }

  async load(email: string) {
    const preferences = await readData(PREFERENCES, email);
    const weightHistory = await readData(WEIGHTS, email);
    const photoHistory = await readData(PHOTOS, email);
    const historyRecords = await readData(WORKOUTS, email);

    runInAction(() => {
      this.preferences = preferences;
      this.weightHistory = weightHistory || [];
      this.photoHistory = photoHistory || [];
      this.historyRecords = historyRecords || [];
      this.loadedEmail = email;
    });
  }

  reset() {
    this.preferences = null;
    this.weightHistory = [];
    this.photoHistory = [];
    this.historyRecords = [];
    this.loadedEmail = null;
  }

  async savePreferences(preferences: FitnessPreferences) {
    this.preferences = preferences;
    this.weightHistory = [
      { date: formatDateISO(new Date()), weight: preferences.weight },
    ];
    await saveData(PREFERENCES, preferences);
    await saveData(WEIGHTS, this.weightHistory);
  }

  async addWeightRecord(weight: number) {
    const today = formatDateISO(new Date());
    const record = this.weightHistory.find(item => item.date === today);

    if (record) {
      record.weight = weight;
    } else {
      this.weightHistory.push({ date: today, weight });
    }
    await saveData(WEIGHTS, this.weightHistory);

    if (this.preferences) {
      this.preferences.weight = weight;
      await saveData(PREFERENCES, this.preferences);
    }
  }

  async updateGoalAndTarget(goal: string, targetWeight: number, level: string) {
    if (this.preferences) {
      Object.assign(this.preferences, { goal, targetWeight, level });
      await saveData(PREFERENCES, this.preferences);
    }
  }

  async addPhotoRecord(uri: string) {
    this.photoHistory.push({
      id: Date.now().toString(),
      date: formatDateISO(new Date()),
      uri,
    });
    await saveData(PHOTOS, this.photoHistory);
  }

  async addHistoryItem(item: Omit<HistoryItem, 'id'>) {
    this.historyRecords = [
      ...this.historyRecords,
      { ...item, id: Date.now().toString() },
    ];
    await saveData(WORKOUTS, this.historyRecords);
  }

  async deleteHistoryItem(id: string) {
    this.historyRecords = this.historyRecords.filter(item => item.id !== id);
    await saveData(WORKOUTS, this.historyRecords);
  }
}

export const fitnessStore = new FitnessStore();
