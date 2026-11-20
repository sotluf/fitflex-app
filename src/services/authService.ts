import EncryptedStorage from 'react-native-encrypted-storage';

export const authService = {
  async saveTokens(accessToken: string, refreshToken: string) {
    await EncryptedStorage.setItem('user_access_token', accessToken);
    await EncryptedStorage.setItem('user_refresh_token', refreshToken);
  },

  getAccessToken() {
    return EncryptedStorage.getItem('user_access_token');
  },

  async clearTokens() {
    await EncryptedStorage.removeItem('user_access_token');
    await EncryptedStorage.removeItem('user_refresh_token');
  },
};
