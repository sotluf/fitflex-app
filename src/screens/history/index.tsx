import React, { useRef, useState } from 'react';
import { SectionList, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { themeStore } from '../../store/ThemeStore';
import { fitnessStore, HistoryItem } from '../../store/FitnessStore';
import { GradientBackground, GradientText } from '../../components/Gradient';
import { colors } from '../../theme';
import {
  formatClock,
  formatDateISO,
  formatDateNice,
  parseDate,
} from '../../utils/helpers';
import { ACTIVITIES } from '../../utils/activities';
import PlusIcon from '../../assets/icons/plus.svg';
import DumbbellIcon from '../../assets/icons/dumbbell.svg';
import { Calendar } from './components/Calendar';
import { AddSheet } from './components/AddSheet';
import { Details } from './components/Details';
import { styles } from './styles';

export default observer(function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const addRef = useRef<BottomSheetModal>(null);
  const detailsRef = useRef<BottomSheetModal>(null);
  const today = formatDateISO(new Date());

  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null);
  const [addDate, setAddDate] = useState(today);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activity, setActivity] = useState(ACTIVITIES[0]);
  const [minutes, setMinutes] = useState('');
  const [distance, setDistance] = useState('');

  const records = fitnessStore.historyRecords;

  const openAdd = () => {
    setAddDate(selectedDate);
    addRef.current?.present();
  };

  const openDetails = (item: HistoryItem) => {
    setActiveItem(item);
    detailsRef.current?.present();
  };

  const handleSave = async () => {
    const duration = parseInt(minutes, 10);
    if (!duration) {
      return;
    }
    const km = parseFloat(distance.replace(',', '.'));
    await fitnessStore.addHistoryItem({
      date: addDate,
      time: formatClock(new Date()),
      title: activity.label,
      duration: `${duration} ${t('common.min')}`,
      distance:
        activity.requiresGps && km > 0
          ? `${km.toFixed(2)} ${t('common.km')}`
          : undefined,
    });
    setMinutes('');
    setDistance('');
    setSelectedDate(addDate);
    setMonthDate(parseDate(addDate));
    addRef.current?.dismiss();
  };

  const handleDelete = async () => {
    await fitnessStore.deleteHistoryItem(activeItem!.id);
    detailsRef.current?.dismiss();
  };

  return (
    <GradientBackground menu>
      <SectionList
        sections={[
          {
            title: selectedDate,
            data: records.filter(item => item.date === selectedDate),
          },
        ]}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <GradientText style={styles.title}>
              {t('history.title')}
            </GradientText>

            <Calendar
              monthDate={monthDate}
              selectedDate={selectedDate}
              records={records}
              onChangeMonth={setMonthDate}
              onSelectDate={setSelectedDate}
            />

            <TouchableOpacity style={styles.addButton} onPress={openAdd}>
              <PlusIcon width={18} height={18} color={colors.onPrimary} />
              <Text style={styles.buttonText}>{t('history.addActivity')}</Text>
            </TouchableOpacity>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>
            {formatDateNice(section.title)}
          </Text>
        )}
        renderItem={({ item }) => {
          const Icon =
            ACTIVITIES.find(a => a.label === item.title)?.icon || DumbbellIcon;
          return (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => openDetails(item)}
            >
              <Icon width={24} height={24} color={colors.primary} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>
                  {t(`activities.${item.title}`, { defaultValue: item.title })}
                </Text>
                <Text style={styles.itemSub}>
                  {[item.time, item.duration, item.distance]
                    .filter(Boolean)
                    .join(' - ')}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('history.empty')}</Text>
        }
      />

      <AddSheet
        sheetRef={addRef}
        addDate={addDate}
        activity={activity}
        minutes={minutes}
        distance={distance}
        onPickDate={() => setPickerOpen(true)}
        onSelectActivity={setActivity}
        onChangeMinutes={setMinutes}
        onChangeDistance={setDistance}
        onSave={handleSave}
      />

      <Details
        sheetRef={detailsRef}
        item={activeItem}
        onDelete={handleDelete}
      />

      <DatePicker
        modal
        open={pickerOpen}
        mode="date"
        date={parseDate(addDate)}
        maximumDate={new Date()}
        locale={i18n.language}
        theme={themeStore.mode === 'dark' ? 'dark' : 'light'}
        title={null}
        confirmText={t('common.save')}
        cancelText={t('common.cancel')}
        onConfirm={date => {
          setPickerOpen(false);
          setAddDate(formatDateISO(date));
        }}
        onCancel={() => setPickerOpen(false)}
      />
    </GradientBackground>
  );
});
