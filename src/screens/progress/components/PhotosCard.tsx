import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { PhotoRecord } from '../../../store/FitnessStore';
import { colors } from '../../../theme';
import CameraIcon from '../../../assets/icons/camera.svg';
import { styles } from './../styles';

type Props = {
  photos: PhotoRecord[];
  onTakePhoto: () => void;
};

export const PhotosCard = observer(function PhotosCard({
  photos,
  onTakePhoto,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{t('progress.gallery')}</Text>
        <TouchableOpacity style={styles.smallButton} onPress={onTakePhoto}>
          <CameraIcon width={14} height={14} color={colors.onPrimary} />
          <Text style={styles.smallButtonText}>{t('progress.photo')}</Text>
        </TouchableOpacity>
      </View>

      {photos.length === 0 ? (
        <Text style={styles.emptyText}>{t('progress.noPhotos')}</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.photos}
        >
          {photos.map(photo => (
            <View key={photo.id} style={styles.photoCard}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <Text style={styles.photoDate}>{photo.date}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
});
