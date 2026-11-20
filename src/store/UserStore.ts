import i18n from '../languages';
import { makeAutoObservable, runInAction } from 'mobx';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

export type UserProfile = {
  username: string;
  email: string;
};

type StoredUser = UserProfile & { pass: string };

const USERS_KEY = 'registered_users_db';
const PROFILE_KEY = 'current_user_profile';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const makeToken = () => Math.random().toString(36).slice(2);

async function readUsers(): Promise<StoredUser[]> {
  const json = await EncryptedStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
}

class UserStore {
  isAuthenticated = false;
  isInitializing = true;
  userProfile: UserProfile | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async restoreSession() {
    const token = await authService.getAccessToken();
    const saved = token ? await AsyncStorage.getItem(PROFILE_KEY) : null;

    runInAction(() => {
      this.isAuthenticated = !!token;
      this.userProfile = saved ? JSON.parse(saved) : null;
      this.isInitializing = false;
    });
  }

  async register(username: string, email: string, pass: string) {
    const users = await readUsers();
    const profile = { username: username.trim(), email: normalizeEmail(email) };

    if (users.some(user => user.email === profile.email)) {
      throw new Error(i18n.t('auth.emailExists'));
    }

    users.push({ ...profile, pass });
    await EncryptedStorage.setItem(USERS_KEY, JSON.stringify(users));
    await this.startSession(profile);
  }

  async login(email: string, pass: string) {
    const users = await readUsers();
    const found = users.find(
      user => user.email === normalizeEmail(email) && user.pass === pass,
    );

    if (!found) {
      throw new Error(i18n.t('auth.wrongCredentials'));
    }
    await this.startSession({ username: found.username, email: found.email });
  }

  async updateUsername(username: string) {
    if (!this.userProfile) {
      return;
    }
    const profile = { ...this.userProfile, username };
    const users = await readUsers();
    const newUsers = users.map(user =>
      user.email === profile.email ? { ...user, username } : user,
    );

    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    await EncryptedStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
    runInAction(() => {
      this.userProfile = profile;
    });
  }

  async logout() {
    await authService.clearTokens();
    await AsyncStorage.removeItem(PROFILE_KEY);
    runInAction(() => {
      this.isAuthenticated = false;
      this.userProfile = null;
    });
  }

  async startSession(profile: UserProfile) {
    await authService.saveTokens(
      'token_' + makeToken(),
      'refresh_' + makeToken(),
    );
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    runInAction(() => {
      this.isAuthenticated = true;
      this.userProfile = profile;
    });
  }
}

export const userStore = new UserStore();
