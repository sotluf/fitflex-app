import { Appearance } from 'react-native';
import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyTheme } from '../theme';

class ThemeStore {
  mode = 'light';
  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  async load() {
    const saved = await AsyncStorage.getItem('app_theme');
    const phoneMode = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
    const mode = saved || phoneMode;

    applyTheme(mode);
    runInAction(() => {
      this.mode = mode;
      this.isLoaded = true;
    });
  }

  async setMode(mode: string) {
    applyTheme(mode);
    this.mode = mode;
    await AsyncStorage.setItem('app_theme', mode);
  }
}

export const themeStore = new ThemeStore();
