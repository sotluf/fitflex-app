import React, { useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import { launchCamera } from 'react-native-image-picker';
import {
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { fitnessStore } from '../../store/FitnessStore';
import { GradientBackground, GradientText } from '../../components/Gradient';
import { sheetProps } from '../../components/Sheet';
import { colors } from '../../theme';
import { WeightCard } from './components/WeightCard';
import { PhotosCard } from './components/PhotosCard';
import { GoalSheet } from './components/GoalSheet';
import { styles } from './styles';

export default observer(function ProgressScreen() {
  const { t } = useTranslation();
  const weightRef = useRef<BottomSheetModal>(null);
  const goalRef = useRef<BottomSheetModal>(null);

  const [weightInput, setWeightInput] = useState('');
  const [goal, setGoal] = useState('weight_loss');
  const [level, setLevel] = useState('beginner');
  const [targetInput, setTargetInput] = useState('');

  const prefs = fitnessStore.preferences;
  const currentWeight = fitnessStore.currentWeight;
  const targetWeight = fitnessStore.targetWeight;

  const openWeightSheet = () => {
    setWeightInput(String(currentWeight));
    weightRef.current?.present();
  };

  const openGoalSheet = () => {
    setGoal(prefs?.goal || 'weight_loss');
    setLevel(prefs?.level || 'beginner');
    setTargetInput(String(targetWeight || ''));
    goalRef.current?.present();
  };

  const handleSaveWeight = async () => {
    const value = parseFloat(weightInput.replace(',', '.'));
    if (!(value > 0)) {
      return showMessage({
        message: t('progress.invalidWeight'),
        type: 'warning',
      });
    }
    await fitnessStore.addWeightRecord(value);
    weightRef.current?.dismiss();
    showMessage({ message: t('progress.weightSaved'), type: 'success' });
  };

  const handleSaveGoal = async () => {
    const value = parseFloat(targetInput.replace(',', '.'));
    if (!(value > 0)) {
      return showMessage({
        message: t('progress.invalidTarget'),
        type: 'warning',
      });
    }
    await fitnessStore.updateGoalAndTarget(goal, value, level);
    goalRef.current?.dismiss();
    showMessage({ message: t('progress.goalUpdated'), type: 'success' });
  };

  const handleTakePhoto = async () => {
    const permission = await request(PERMISSIONS.ANDROID.CAMERA);
    if (permission !== RESULTS.GRANTED) {
      return Alert.alert(t('progress.cameraOff'), t('progress.cameraOffText'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('progress.openSettings'), onPress: openSettings },
      ]);
    }
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    const uri = result.assets?.[0]?.uri;
    if (uri) {
      await fitnessStore.addPhotoRecord(uri);
    }
  };

  const history = fitnessStore.weightHistory.slice(-7);
  const startWeight = fitnessStore.weightHistory[0]?.weight ?? currentWeight;

  return (
    <GradientBackground menu>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GradientText style={styles.title}>{t('progress.title')}</GradientText>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.goalTitle}>{t(`goals.${prefs?.goal}`)}</Text>
            <TouchableOpacity onPress={openGoalSheet}>
              <Text style={styles.linkText}>{t('progress.editGoal')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subText}>
            {`${t(`levels.${prefs?.level}`)} / ${targetWeight} ${t('common.kg')}`}
          </Text>
        </View>

        <WeightCard
          currentWeight={currentWeight}
          targetWeight={targetWeight}
          startWeight={startWeight}
          history={history}
          onAdd={openWeightSheet}
        />

        <PhotosCard
          photos={fitnessStore.photoHistory}
          onTakePhoto={handleTakePhoto}
        />
      </ScrollView>

      <BottomSheetModal ref={weightRef} {...sheetProps()}>
        <BottomSheetView style={styles.sheet}>
          <Text style={styles.sheetTitle}>{t('progress.logWeight')}</Text>
          <BottomSheetTextInput
            style={styles.input}
            placeholder={t('progress.weightHint')}
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={weightInput}
            onChangeText={setWeightInput}
          />
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.grayButton}
              onPress={() => weightRef.current?.dismiss()}
            >
              <Text style={styles.grayButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSaveWeight}>
              <Text style={styles.buttonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <GoalSheet
        sheetRef={goalRef}
        goal={goal}
        level={level}
        targetInput={targetInput}
        onChangeGoal={setGoal}
        onChangeLevel={setLevel}
        onChangeTarget={setTargetInput}
        onSave={handleSaveGoal}
      />
    </GradientBackground>
  );
});
