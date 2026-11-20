import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { I18nextProvider, useTranslation } from 'react-i18next';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { CopilotProvider } from 'react-native-copilot';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import SplashScreen from 'react-native-splash-screen';

import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/auth/LoginScreen';
import QuizScreen from './src/screens/auth/QuizScreen';
import SecuritySetupScreen from './src/screens/security/SecuritySetupScreen';
import LockScreen from './src/screens/security/LockScreen';
import { userStore } from './src/store/UserStore';
import { fitnessStore } from './src/store/FitnessStore';
import { themeStore } from './src/store/ThemeStore';
import i18n, { loadLanguage } from './src/languages';
import { applyTheme, colors, radius } from './src/theme';
import {
  securityService,
  SecuritySettings,
} from './src/services/securityService';

applyTheme('light');
configureReanimatedLogger({ level: ReanimatedLogLevel.error, strict: false });

function Messages() {
  const insets = useSafeAreaInsets();
  return <FlashMessage position="top" floating statusBarHeight={insets.top} />;
}

const AppContent = observer(function AppContent() {
  const { t } = useTranslation();
  const email = userStore.userProfile?.email;

  const [security, setSecurity] = useState('checking');
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [splashDone, setSplashDone] = useState(false);

  const startedWithSession = useRef<boolean | null>(null);
  if (startedWithSession.current === null && !userStore.isInitializing) {
    startedWithSession.current = userStore.isAuthenticated;
  }

  const checkSecurity = async (userEmail: string) => {
    const saved = await securityService.getSettings(userEmail);
    if (!saved) {
      return setSecurity('setup');
    }

    const hasProtection = saved.biometricEnabled || !!saved.pin;
    setSettings(saved);
    setSecurity(
      startedWithSession.current && hasProtection ? 'locked' : 'unlocked',
    );
    startedWithSession.current = false;
  };

  useEffect(() => {
    loadLanguage();
    themeStore.load();
    userStore.restoreSession();

    const timer = setTimeout(() => {
      setSplashDone(true);
      SplashScreen.hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userStore.isInitializing) {
      return;
    }
    if (email) {
      fitnessStore.load(email);
      checkSecurity(email);
    } else {
      fitnessStore.reset();
      setSecurity('checking');
      setSettings(null);
    }
  }, [email, userStore.isInitializing]);

  const handleSaveSecurity = async (useBiometrics: boolean, pin: string) => {
    if (
      useBiometrics &&
      !(await securityService.authenticate(t('security.confirmBio')))
    ) {
      return showMessage({
        message: t('security.bioFailed'),
        description: t('security.bioFailedText'),
        type: 'warning',
      });
    }

    const newSettings = { biometricEnabled: useBiometrics, pin };
    await securityService.saveSettings(email!, newSettings);
    setSettings(newSettings);
    setSecurity('unlocked');
    showMessage({ message: t('security.saved'), type: 'success' });
  };

  const handleSkipSecurity = async () => {
    await securityService.saveSettings(email!, {
      biometricEnabled: false,
      pin: null,
    });
    setSecurity('unlocked');
  };

  const isFitnessLoading = !!email && fitnessStore.loadedEmail !== email;
  const showLoader =
    !splashDone ||
    userStore.isInitializing ||
    !themeStore.isLoaded ||
    (userStore.isAuthenticated &&
      (isFitnessLoading || security === 'checking'));

  let content;
  if (showLoader) {
    content = (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.gradientStart,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.text }}>
          {t('common.loading')}
        </Text>
      </View>
    );
  } else if (!userStore.isAuthenticated) {
    content = <LoginScreen />;
  } else if (security === 'locked' && settings) {
    content = (
      <LockScreen
        settings={settings}
        onUnlock={() => setSecurity('unlocked')}
        onLogout={() => userStore.logout()}
      />
    );
  } else if (!fitnessStore.isQuizCompleted) {
    content = <QuizScreen />;
  } else if (security === 'setup') {
    content = (
      <SecuritySetupScreen
        onSave={handleSaveSecurity}
        onSkip={handleSkipSecurity}
      />
    );
  } else {
    content = (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={
            themeStore.mode === 'dark' ? 'light-content' : 'dark-content'
          }
        />
        <View style={{ flex: 1 }} key={themeStore.mode}>
          <BottomSheetModalProvider>
            <CopilotProvider
              androidStatusBarVisible
              labels={{
                previous: t('tour.previous'),
                next: t('tour.next'),
                skip: t('tour.skip'),
                finish: t('tour.finish'),
              }}
              backdropColor="rgba(0, 0, 0, 0.6)"
              arrowColor="#FFFFFF"
              tooltipStyle={{ borderRadius: radius.md }}
            >
              {content}
            </CopilotProvider>
          </BottomSheetModalProvider>
        </View>
        <Messages />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}
