import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import { securityService } from '../../services/securityService';
import { GradientBackground, GradientText } from '../../components/Gradient';
import { colors } from '../../theme';
import { styles } from './styles';

type Props = {
  onSave: (enableBiometrics: boolean, pin: string) => void;
  onSkip: () => void;
};

export default function SecuritySetupScreen({ onSave, onSkip }: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('choose');
  const [pin, setPin] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    securityService.isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  const handleSave = () => {
    if (!/^\d{4}$/.test(pin)) {
      return showMessage({
        message: t('security.invalidPin'),
        description: t('security.invalidPinText'),
        type: 'warning',
      });
    }
    onSave(mode === 'withBio', pin);
  };

  const goBack = () => {
    setMode('choose');
    setPin('');
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <GradientText style={styles.title}>
          {t('security.secureApp')}
        </GradientText>

        <View style={styles.setupButtons}>
          {mode === 'choose' ? (
            <>
              {biometricAvailable ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setMode('withBio')}
                >
                  <Text style={styles.buttonText}>{t('security.bioPin')}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.hint}>{t('security.noBio')}</Text>
              )}

              <TouchableOpacity
                style={
                  biometricAvailable ? styles.outlineButton : styles.button
                }
                onPress={() => setMode('pinOnly')}
              >
                <Text
                  style={
                    biometricAvailable
                      ? styles.outlineButtonText
                      : styles.buttonText
                  }
                >
                  {t('security.pinOnly')}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>
                {mode === 'withBio'
                  ? t('security.backupPin')
                  : t('security.setPin')}
              </Text>
              <TextInput
                style={styles.pinInput}
                placeholder="****"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={text => setPin(text.replace(/\D/g, ''))}
              />
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>
                  {t('security.saveContinue')}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity onPress={mode === 'choose' ? onSkip : goBack}>
          <Text style={styles.linkText}>
            {mode === 'choose' ? t('security.skip') : t('common.back')}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
