import React, { RefObject } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { sheetProps } from '../../../components/Sheet';
import { colors } from '../../../theme';
import { styles } from './../styles';

export type Contact = { id: string; name: string; phone: string };

type Props = {
  sheetRef: RefObject<BottomSheetModal | null>;
  contacts: Contact[];
  search: string;
  onChangeSearch: (value: string) => void;
  onInvite: (contact: Contact) => void;
};

export function ContactsSheet({
  sheetRef,
  contacts,
  search,
  onChangeSearch,
  onInvite,
}: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={['70%']}
      enableDynamicSizing={false}
      {...sheetProps()}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{t('menu.inviteTitle')}</Text>
        <BottomSheetTextInput
          style={styles.input}
          value={search}
          onChangeText={onChangeSearch}
          placeholder={t('menu.searchContact')}
          placeholderTextColor={colors.textMuted}
        />
      </View>
      <BottomSheetFlatList
        data={contacts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('menu.noContacts')}</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => onInvite(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </TouchableOpacity>
        )}
      />
    </BottomSheetModal>
  );
}
