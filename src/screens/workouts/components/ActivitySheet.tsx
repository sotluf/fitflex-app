import React, { RefObject } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { sheetProps } from '../../../components/Sheet';
import { colors } from '../../../theme';
import { ACTIVITIES, Activity } from '../../../utils/activities';
import { styles } from './../styles';

type Props = {
  sheetRef: RefObject<BottomSheetModal | null>;
  activity: Activity;
  onSelect: (item: Activity) => void;
};

export function ActivitySheet({ sheetRef, activity, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={['60%']}
      enableDynamicSizing={false}
      {...sheetProps()}
    >
      <BottomSheetFlatList
        data={ACTIVITIES}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.sheetList}
        renderItem={({ item }) => {
          const isSelected = item.id === activity.id;
          return (
            <TouchableOpacity
              style={[
                styles.activityItem,
                isSelected && styles.activityItemSelected,
              ]}
              onPress={() => onSelect(item)}
            >
              <item.icon width={20} height={20} color={colors.primary} />
              <Text
                style={[
                  styles.activityText,
                  isSelected && styles.activityTextSelected,
                ]}
              >
                {t(`activities.${item.label}`)}
              </Text>
              {item.requiresGps && <Text style={styles.gpsBadge}>GPS</Text>}
            </TouchableOpacity>
          );
        }}
      />
    </BottomSheetModal>
  );
}
