import React, { RefObject } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { sheetProps } from '../../../components/Sheet';
import { colors } from '../../../theme';
import { styles } from './../styles';

type Props = {
  sheetRef: RefObject<BottomSheetModal | null>;
  goal: string;
  level: string;
  targetInput: string;
  onChangeGoal: (value: string) => void;
  onChangeLevel: (value: string) => void;
  onChangeTarget: (value: string) => void;
  onSave: () => void;
};

const GOALS = ['weight_loss', 'muscle_gain', 'endurance'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];

export function GoalSheet({
  sheetRef,
  goal,
  level,
  targetInput,
  onChangeGoal,
  onChangeLevel,
  onChangeTarget,
  onSave,
}: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheetModal ref={sheetRef} {...sheetProps()}>
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.sheetTitle}>{t('progress.editGoal')}</Text>

        <Text style={styles.label}>{t('progress.goalLabel')}</Text>
        <View style={styles.chips}>
          {GOALS.map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, goal === item && styles.chipActive]}
              onPress={() => onChangeGoal(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  goal === item && styles.chipTextActive,
                ]}
              >
                {t(`goals.${item}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t('progress.level')}</Text>
        <View style={styles.chips}>
          {LEVELS.map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, level === item && styles.chipActive]}
              onPress={() => onChangeLevel(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  level === item && styles.chipTextActive,
                ]}
              >
                {t(`levels.${item}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t('progress.targetLabel')}</Text>
        <BottomSheetTextInput
          style={styles.input}
          placeholder={t('progress.targetHint')}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={targetInput}
          onChangeText={onChangeTarget}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.grayButton}
            onPress={() => sheetRef.current?.dismiss()}
          >
            <Text style={styles.grayButtonText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSave}>
            <Text style={styles.buttonText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
