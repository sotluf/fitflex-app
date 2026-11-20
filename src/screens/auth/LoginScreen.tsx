import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import RenderHtml from '@native-html/render';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { notificationService } from '../../services/notificationService';
import { userStore } from '../../store/UserStore';
import { GradientBackground, GradientText } from '../../components/Gradient';
import { sheetProps } from '../../components/Sheet';
import { colors } from '../../theme';
import EyeIcon from '../../assets/icons/eye.svg';
import EyeOffIcon from '../../assets/icons/eye-off.svg';
import { styles, getHtmlStyles } from './styles';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_RULES = ['auth.ruleLength', 'auth.ruleCase', 'auth.ruleNumber'];

export default function LoginScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const termsRef = useRef<BottomSheetModal>(null);

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isPasswordStrong =
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  const showWarning = (description: string) => {
    showMessage({
      message: t('common.checkData'),
      description,
      type: 'warning',
    });
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password || (isRegistering && !username.trim())) {
      return showWarning(t('auth.fillAll'));
    }
    if (!isEmailValid) {
      return showWarning(t('auth.invalidEmail'));
    }
    if (isRegistering && !isPasswordStrong) {
      return showWarning(t('auth.weakPassword'));
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        await userStore.register(username, email, password);
        showMessage({ message: t('auth.accountCreated'), type: 'success' });
        notificationService.show(
          t('notify.welcomeTitle'),
          t('notify.welcomeText', { name: username }),
        );
      } else {
        await userStore.login(email, password);
      }
    } catch (error: any) {
      showMessage({
        message: t('common.error'),
        description: error.message,
        type: 'danger',
      });
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setPassword('');
    setShowPassword(false);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <GradientText style={styles.title}>FitFlex</GradientText>
          <Text style={styles.subtitle}>
            {isRegistering ? t('auth.createAccount') : t('auth.welcomeBack')}
          </Text>

          <View style={styles.card}>
            {isRegistering && (
              <TextInput
                placeholder={t('auth.username')}
                placeholderTextColor={colors.textMuted}
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />
            )}

            <TextInput
              placeholder={t('auth.email')}
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              style={[
                styles.input,
                email.length > 0 && !isEmailValid && styles.inputError,
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View>
              <TextInput
                placeholder={t('auth.password')}
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                style={[styles.input, styles.passwordInput]}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon width={24} height={24} color={colors.textMuted} />
                ) : (
                  <EyeIcon width={24} height={24} color={colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>

            {isRegistering &&
              PASSWORD_RULES.map(rule => (
                <Text key={rule} style={styles.ruleText}>
                  - {t(rule)}
                </Text>
              ))}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading
                  ? t('auth.wait')
                  : isRegistering
                  ? t('auth.register')
                  : t('auth.signIn')}
              </Text>
            </TouchableOpacity>

            {isRegistering && (
              <Text style={styles.smallText}>
                {t('auth.agree')}{' '}
                <Text
                  style={styles.link}
                  onPress={() => termsRef.current?.present()}
                >
                  {t('auth.termsLink')}
                </Text>
              </Text>
            )}
          </View>

          <Text style={[styles.smallText, styles.switchText]}>
            {isRegistering ? t('auth.haveAccount') : t('auth.noAccount')}
            <Text style={styles.link} onPress={toggleMode}>
              {isRegistering ? t('auth.signIn') : t('auth.register')}
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheetModal
        ref={termsRef}
        snapPoints={['45%']}
        enableDynamicSizing={false}
        {...sheetProps()}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheet}>
          <Text style={styles.sheetTitle}>{t('auth.termsTitle')}</Text>
          <RenderHtml
            contentWidth={width - 40}
            source={{ html: t('auth.termsHtml') }}
            tagsStyles={getHtmlStyles()}
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </GradientBackground>
  );
}
