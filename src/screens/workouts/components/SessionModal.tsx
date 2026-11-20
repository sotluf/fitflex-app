import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GradientBackground } from '../../../components/Gradient';
import PlayIcon from '../../../assets/icons/play.svg';
import CloseIcon from '../../../assets/icons/close.svg';
import CheckIcon from '../../../assets/icons/check.svg';
import PauseIcon from '../../../assets/icons/pause.svg';
import { colors } from '../../../theme';
import { Activity } from '../../../utils/activities';
import { formatTimer } from '../../../utils/helpers';
import { styles } from './../styles';

type Props = {
  visible: boolean;
  activity: Activity;
  isPaused: boolean;
  seconds: number;
  pauseLeft: number;
  distanceKm: number;
  onCancel: () => void;
  onPause: (pauseSeconds: number) => void;
  onResume: () => void;
  onFinish: () => void;
};

const PAUSES = [30, 60];

export function SessionModal({
  visible,
  activity,
  isPaused,
  seconds,
  pauseLeft,
  distanceKm,
  onCancel,
  onPause,
  onResume,
  onFinish,
}: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <GradientBackground>
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionTitle}>
            {t(`activities.${activity.label}`)}
          </Text>
          <Text style={styles.statusText}>
            {isPaused ? t('workouts.paused') : t('workouts.inProgress')}
          </Text>

          <Text
            style={[styles.time, isPaused && styles.timePaused]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatTimer(isPaused ? pauseLeft : seconds)}
          </Text>
          {activity.requiresGps && (
            <Text style={styles.distanceText}>
              {distanceKm.toFixed(2)} {t('common.km')}
            </Text>
          )}

          <View style={styles.controls}>
            <TouchableOpacity style={styles.circle} onPress={onCancel}>
              <CloseIcon width={26} height={26} color={colors.textMuted} />
            </TouchableOpacity>

            {isPaused ? (
              <TouchableOpacity
                style={[styles.circle, styles.circleMain]}
                onPress={onResume}
              >
                <PlayIcon width={28} height={28} color={colors.onPrimary} />
              </TouchableOpacity>
            ) : (
              PAUSES.map(pauseSeconds => (
                <TouchableOpacity
                  key={pauseSeconds}
                  style={styles.circle}
                  onPress={() => onPause(pauseSeconds)}
                >
                  <PauseIcon width={18} height={18} color={colors.primary} />
                  <Text style={styles.circleText}>
                    {pauseSeconds} {t('common.sec')}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              style={[styles.circle, styles.circleMain]}
              onPress={onFinish}
            >
              <CheckIcon width={28} height={28} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    </Modal>
  );
}
