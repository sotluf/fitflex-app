import React, { RefObject } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { sheetProps } from '../../../components/Sheet';
import { HistoryItem } from '../../../store/FitnessStore';
import { formatDateNice } from '../../../utils/helpers';
import { styles } from './../styles';

type Props = {
  sheetRef: RefObject<BottomSheetModal | null>;
  item: HistoryItem | null;
  onDelete: () => void;
};

export const Details = observer(function Details({
  sheetRef,
  item,
  onDelete,
}: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheetModal ref={sheetRef} {...sheetProps()}>
      <BottomSheetView style={styles.sheet}>
        {item && (
          <>
            <Text style={styles.sheetTitle}>
              {t(`activities.${item.title}`, {
                defaultValue: item.title,
              })}
            </Text>
            <Text style={styles.sheetText}>
              {formatDateNice(item.date)}, {item.time}
            </Text>
            <Text style={styles.sheetText}>
              {t('history.duration')}: {item.duration}
            </Text>
            {item.distance && (
              <Text style={styles.sheetText}>
                {t('history.distanceLabel')}: {item.distance}
              </Text>
            )}
            {item.notes && (
              <Text style={styles.sheetText}>
                {t('history.notes')}: {item.notes}
              </Text>
            )}
            <View style={styles.row}>
              <TouchableOpacity style={styles.dangerButton} onPress={onDelete}>
                <Text style={styles.dangerButtonText}>
                  {t('common.delete')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => sheetRef.current?.dismiss()}
              >
                <Text style={styles.buttonText}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
