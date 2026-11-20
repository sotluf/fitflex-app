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
import { formatDateNice } from '../../../utils/helpers';
import { ACTIVITIES, Activity } from '../../../utils/activities';
import { styles } from './../styles';

type Props = {
  sheetRef: RefObject<BottomSheetModal | null>;
  addDate: string;
  activity: Activity;
  minutes: string;
  distance: string;
  onPickDate: () => void;
  onSelectActivity: (item: Activity) => void;
  onChangeMinutes: (value: string) => void;
  onChangeDistance: (value: string) => void;
  onSave: () => void;
};

export function AddSheet({
  sheetRef,
  addDate,
  activity,
  minutes,
  distance,
  onPickDate,
  onSelectActivity,
  onChangeMinutes,
  onChangeDistance,
  onSave,
}: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheetModal ref={sheetRef} {...sheetProps()}>
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.sheetTitle}>{t('history.addActivity')}</Text>

        <TouchableOpacity style={styles.dateButton} onPress={onPickDate}>
          <Text style={styles.dateButtonText}>{formatDateNice(addDate)}</Text>
        </TouchableOpacity>

        <View style={styles.chips}>
          {ACTIVITIES.map(item => {
            const isActive = item.id === activity.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onSelectActivity(item)}
              >
                <item.icon
                  width={16}
                  height={16}
                  color={isActive ? colors.onPrimary : colors.primary}
                />
                <Text
                  style={[styles.chipText, isActive && styles.chipTextActive]}
                >
                  {t(`activities.${item.label}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <BottomSheetTextInput
          style={styles.input}
          placeholder={t('history.minutes')}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={minutes}
          onChangeText={onChangeMinutes}
        />
        {activity.requiresGps && (
          <BottomSheetTextInput
            style={styles.input}
            placeholder={t('history.distance')}
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={distance}
            onChangeText={onChangeDistance}
          />
        )}

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
