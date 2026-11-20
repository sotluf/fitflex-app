import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import WorkoutsScreen from '../screens/workouts';
import ProgressScreen from '../screens/progress';
import HistoryScreen from '../screens/history';
import DumbbellIcon from '../assets/icons/dumbbell.svg';
import ChartIcon from '../assets/icons/chart.svg';
import CalendarIcon from '../assets/icons/calendar.svg';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const TourButton = walkthroughable(TouchableOpacity);

const tabButton = (text: string, order: number, name: string) => (props: any) =>
  (
    <CopilotStep text={text} order={order} name={name}>
      <TourButton {...props} />
    </CopilotStep>
  );

export default function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface },
      }}
    >
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          title: t('tabs.workouts'),
          tabBarIcon: ({ color }) => (
            <DumbbellIcon width={26} height={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: t('tabs.progress'),
          tabBarIcon: ({ color }) => (
            <ChartIcon width={26} height={26} color={color} />
          ),
          tabBarButton: tabButton(t('tour.progress'), 4, 'progress'),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color }) => (
            <CalendarIcon width={26} height={26} color={color} />
          ),
          tabBarButton: tabButton(t('tour.history'), 5, 'history'),
        }}
      />
    </Tab.Navigator>
  );
}
