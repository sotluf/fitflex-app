import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import {
  SecuritySettings,
  securityService,
} from '../../services/securityService';
import { GradientBackground, GradientText } from '../../components/Gradient';
import { colors } from '../../theme';
import LockIcon from '../../assets/icons/lock.svg';
import DeleteIcon from '../../assets/icons/chevron-left.svg';
import { styles } from './styles';

type Props = {
  settings: SecuritySettings;
  onUnlock: () => void;
  onLogout: () => void;
};

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function LockScreen({ settings, onUnlock, onLogout }: Props) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');

  const tryBiometrics = async () => {
    if (await securityService.authenticate(t('security.unlockPrompt'))) {
      onUnlock();
    }
  };

  useEffect(() => {
    if (settings.biometricEnabled) {
      tryBiometrics();
    }
  }, []);

  const addDigit = (digit: string) => {
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      if (newPin === settings.pin) {
        onUnlock();
      } else {
        setPin('');
        showMessage({ message: t('security.wrongPin'), type: 'danger' });
      }
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <GradientText style={styles.title}>{t('security.locked')}</GradientText>
        <Text style={styles.subtitle}>{t('security.enterPin')}</Text>

        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map(number => (
            <View
              key={number}
              style={[styles.dot, pin.length > number && styles.dotFilled]}
            />
          ))}
        </View>

        <View style={styles.keypad}>
          {DIGITS.map(digit => (
            <TouchableOpacity
              key={digit}
              style={styles.key}
              onPress={() => addDigit(digit)}
            >
              <Text style={styles.keyText}>{digit}</Text>
            </TouchableOpacity>
          ))}

          {settings.biometricEnabled ? (
            <TouchableOpacity style={styles.key} onPress={tryBiometrics}>
              <LockIcon width={30} height={30} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyKey} />
          )}

          <TouchableOpacity style={styles.key} onPress={() => addDigit('0')}>
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.key}
            onPress={() => setPin(pin.slice(0, -1))}
          >
            <DeleteIcon width={30} height={30} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutText}>{t('common.logOut')}</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}
