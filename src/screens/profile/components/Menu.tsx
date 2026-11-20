import React, { RefObject } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { userStore } from '../../../store/UserStore';
import { themeStore } from '../../../store/ThemeStore';
import { setLanguage } from '../../../languages';
import { sheetProps } from '../../../components/Sheet';
import { colors } from '../../../theme';
import { styles } from './../styles';

type Props = {
  sheetRef: RefObject<BottomSheetModal | null>;
  name: string;
  editing: boolean;
  newName: string;
  onChangeName: (value: string) => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveName: () => void;
  onThemeChange: (isDark: boolean) => void;
  onInvite: () => void;
  onLogout: () => void;
};

export const Menu = observer(
  ({
    sheetRef,
    name,
    editing,
    newName,
    onChangeName,
    onStartEditing,
    onCancelEditing,
    onSaveName,
    onThemeChange,
    onInvite,
    onLogout,
  }: Props) => {
    const { t, i18n } = useTranslation();

    return (
      <BottomSheetModal ref={sheetRef} {...sheetProps()}>
        <BottomSheetView style={styles.sheet}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{userStore.userProfile?.email}</Text>

          {editing ? (
            <>
              <BottomSheetTextInput
                style={styles.input}
                value={newName}
                onChangeText={onChangeName}
                placeholder={t('menu.newName')}
                placeholderTextColor={colors.textMuted}
              />
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.grayButton}
                  onPress={onCancelEditing}
                >
                  <Text style={styles.grayButtonText}>
                    {t('common.cancel')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onSaveName}>
                  <Text style={styles.buttonText}>{t('common.save')}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity style={styles.item} onPress={onStartEditing}>
              <Text style={styles.itemText}>{t('menu.changeName')}</Text>
            </TouchableOpacity>
          )}

          <View style={[styles.item, styles.switchRow]}>
            <Text style={styles.itemText}>{t('menu.language')}</Text>
            <View style={styles.langRow}>
              {['en', 'uk'].map(language => {
                const isActive = i18n.language === language;
                return (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.langButton,
                      isActive && styles.langButtonActive,
                    ]}
                    onPress={() => setLanguage(language)}
                  >
                    <Text
                      style={[
                        styles.langText,
                        isActive && styles.langTextActive,
                      ]}
                    >
                      {language === 'en' ? 'EN' : 'UA'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={[styles.item, styles.switchRow]}>
            <Text style={styles.itemText}>{t('menu.darkTheme')}</Text>
            <Switch
              value={themeStore.mode === 'dark'}
              onValueChange={onThemeChange}
              trackColor={{ false: colors.ringTrack, true: colors.primary }}
              thumbColor={colors.onPrimary}
            />
          </View>

          <TouchableOpacity style={styles.item} onPress={onInvite}>
            <Text style={styles.itemText}>{t('menu.invite')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={onLogout}>
            <Text style={styles.logoutText}>{t('common.logOut')}</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
