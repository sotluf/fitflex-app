import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { YouTubeVideo } from '../../../services/youtubeService';
import { styles } from './../styles';

type Props = {
  video: YouTubeVideo;
  index: number;
  onPress: () => void;
};

export function VideoCard({ video, index, onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity
        style={styles.videoCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.videoThumbnail}
        />
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {video.title}
          </Text>
          <Text style={styles.videoMeta}>
            {video.channelTitle}
            {video.durationMinutes
              ? ` - ${video.durationMinutes} ${t('common.min')}`
              : ''}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
