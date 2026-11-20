import { PermissionsAndroid, Platform } from 'react-native';
import { Notification, Notifications } from 'react-native-notifications';

export const notificationService = {
  async show(title: string, body: string) {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }
    Notifications.postLocalNotification({ title, body } as Notification);
  },
};