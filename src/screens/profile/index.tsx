import React, { useRef, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import Contacts from 'react-native-contacts';
import {
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Share, { Social } from 'react-native-share';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { userStore } from '../../store/UserStore';
import { themeStore } from '../../store/ThemeStore';
import { colors } from '../../theme';
import MenuIcon from '../../assets/icons/menu.svg';
import { Menu } from './components/Menu';
import { ContactsSheet, Contact } from './components/Contacts';
import { styles } from './styles';

const TourButton = walkthroughable(TouchableOpacity);

export const ProfileMenuButton = observer(
  ({ tour = false }: { tour?: boolean }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const menuRef = useRef<BottomSheetModal>(null);
    const contactsRef = useRef<BottomSheetModal>(null);

    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [search, setSearch] = useState('');

    const name =
      userStore.userProfile?.username || t('greeting.usernameDefault');
    const visibleContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(search.toLowerCase()),
    );

    const startEditing = () => {
      setNewName(name);
      setEditing(true);
    };

    const handleSaveName = async () => {
      if (!newName.trim()) {
        return;
      }
      await userStore.updateUsername(newName.trim());
      setEditing(false);
      showMessage({ message: t('menu.nameUpdated'), type: 'success' });
    };

    const openContacts = async () => {
      const permission = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
      if (permission !== RESULTS.GRANTED) {
        return Alert.alert(
          t('menu.contactsDenied'),
          t('menu.contactsDeniedText'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('progress.openSettings'), onPress: openSettings },
          ],
        );
      }

      const allContacts = await Contacts.getAllWithoutPhotos();
      const list = allContacts
        .filter(contact => contact.phoneNumbers.length > 0)
        .map(contact => ({
          id: contact.recordID,
          name: contact.displayName || contact.givenName || '',
          phone: contact.phoneNumbers[0].number,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setContacts(list);
      setSearch('');
      menuRef.current?.dismiss();
      contactsRef.current?.present();
    };

    const handleInvite = (contact: Contact) => {
      contactsRef.current?.dismiss();
      Share.shareSingle({
        social: Social.Sms,
        recipient: contact.phone,
        message: t('menu.inviteMessage', { name: contact.name }),
      }).catch(() => {});
    };

    const handleLogout = () => {
      menuRef.current?.dismiss();
      userStore.logout();
    };

    const handleThemeChange = (isDark: boolean) => {
      menuRef.current?.dismiss();
      themeStore.setMode(isDark ? 'dark' : 'light');
    };

    return (
      <>
        <CopilotStep text={t('tour.menu')} order={1} name="menu" active={tour}>
          <TourButton
            style={[styles.burger, { top: insets.top + 16 }]}
            onPress={() => menuRef.current?.present()}
          >
            <MenuIcon width={24} height={24} color={colors.text} />
          </TourButton>
        </CopilotStep>

        <Menu
          sheetRef={menuRef}
          name={name}
          editing={editing}
          newName={newName}
          onChangeName={setNewName}
          onStartEditing={startEditing}
          onCancelEditing={() => setEditing(false)}
          onSaveName={handleSaveName}
          onThemeChange={handleThemeChange}
          onInvite={openContacts}
          onLogout={handleLogout}
        />

        <ContactsSheet
          sheetRef={contactsRef}
          contacts={visibleContacts}
          search={search}
          onChangeSearch={setSearch}
          onInvite={handleInvite}
        />
      </>
    );
  },
);
