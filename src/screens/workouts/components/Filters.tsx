import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { styles } from './../styles';

type Props = {
  focus: string;
  onChange: (filter: string) => void;
};

const FILTERS = ['all', 'chest', 'back', 'legs', 'cardio'];

const TourView = walkthroughable(View);

export function Filters({ focus, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View>
      <CopilotStep text={t('tour.videos')} order={3} name="videos">
        <TourView>
          <Text style={styles.sectionTitle}>{t('workouts.recommended')}</Text>
        </TourView>
      </CopilotStep>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              focus === filter && styles.filterChipActive,
            ]}
            onPress={() => onChange(filter)}
          >
            <Text
              style={[
                styles.filterText,
                focus === filter && styles.filterTextActive,
              ]}
            >
              {t(`workouts.filters.${filter}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
