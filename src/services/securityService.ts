import EncryptedStorage from 'react-native-encrypted-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

export type SecuritySettings = {
  biometricEnabled: boolean;
  pin: string | null;
};

const biometrics = new ReactNativeBiometrics();

export const securityService = {
  async getSettings(email: string) {
    const json = await EncryptedStorage.getItem('security_' + email);
    return json ? (JSON.parse(json) as SecuritySettings) : null;
  },

  saveSettings(email: string, settings: SecuritySettings) {
    return EncryptedStorage.setItem(
      'security_' + email,
      JSON.stringify(settings),
    );
  },

  async isBiometricAvailable() {
    const { available } = await biometrics.isSensorAvailable();
    return available;
  },

  async authenticate(promptMessage: string) {
    const { success } = await biometrics.simplePrompt({
      promptMessage,
      cancelButtonText: 'Use PIN',
    });
    return success;
  },
};
