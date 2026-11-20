import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { colors } from '../../../theme';
import { HistoryItem } from '../../../store/FitnessStore';
import { formatDateISO, getList } from '../../../utils/helpers';
import ChevronLeftIcon from '../../../assets/icons/chevron-left.svg';
import ChevronRightIcon from '../../../assets/icons/chevron-right.svg';
import { styles } from './../styles';

type Props = {
  monthDate: Date;
  selectedDate: string;
  records: HistoryItem[];
  onChangeMonth: (date: Date) => void;
  onSelectDate: (date: string) => void;
};

export const Calendar = observer(function Calendar({
  monthDate,
  selectedDate,
  records,
  onChangeMonth,
  onSelectDate,
}: Props) {
  const today = formatDateISO(new Date());
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const emptyCells = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from(
    { length: emptyCells + daysInMonth },
    (_, i) => i - emptyCells + 1,
  );
  const weekdaysShort = getList('weekdaysShort');
  const weekDays = [...weekdaysShort.slice(1), weekdaysShort[0]];

  return (
    <View style={styles.card}>
      <View style={styles.monthRow}>
        <TouchableOpacity
          onPress={() => onChangeMonth(new Date(year, month - 1, 1))}
        >
          <ChevronLeftIcon width={24} height={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {getList('months')[month]} {year}
        </Text>
        <TouchableOpacity
          onPress={() => onChangeMonth(new Date(year, month + 1, 1))}
        >
          <ChevronRightIcon width={24} height={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.daysGrid}>
        {weekDays.map(name => (
          <Text key={name} style={styles.weekDay}>
            {name}
          </Text>
        ))}
        {days.map((day, index) => {
          if (day < 1) {
            return <View key={index} style={styles.dayCell} />;
          }
          const date = formatDateISO(new Date(year, month, day));
          const isSelected = date === selectedDate;
          return (
            <TouchableOpacity
              key={index}
              style={styles.dayCell}
              onPress={() => onSelectDate(date)}
            >
              <View
                style={[
                  styles.dayCircle,
                  date === today && styles.dayToday,
                  isSelected && styles.daySelected,
                ]}
              >
                <Text
                  style={[styles.dayText, isSelected && styles.dayTextSelected]}
                >
                  {day}
                </Text>
              </View>
              {records.some(item => item.date === date) && (
                <View style={styles.dot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});
