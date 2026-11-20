import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import PlayIcon from '../../../assets/icons/play.svg';
import ChevronDownIcon from '../../../assets/icons/chevron-down.svg';
import { colors } from '../../../theme';
import { Activity } from '../../../utils/activities';
import { styles } from './../styles';

type Props = {
  activity: Activity;
  onPickActivity: () => void;
  onStart: () => void;
};

const TourView = walkthroughable(View);

export function StartCard({ activity, onPickActivity, onStart }: Props) {
  const { t } = useTranslation();

  return (
    <CopilotStep text={t('tour.start')} order={2} name="start">
      <TourView style={styles.card}>
        <Text style={styles.cardTitle}>{t('workouts.startNew')}</Text>
        <Text style={styles.cardSubtitle}>{t('workouts.chooseActivity')}</Text>

        <TouchableOpacity style={styles.pickerButton} onPress={onPickActivity}>
          <Text style={styles.pickerButtonText}>
            {t(`activities.${activity.label}`)}
          </Text>
          <ChevronDownIcon width={20} height={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <PlayIcon width={20} height={20} color={colors.onPrimary} />
          <Text style={styles.buttonText}>{t('workouts.start')}</Text>
        </TouchableOpacity>
      </TourView>
    </CopilotStep>
  );
}
