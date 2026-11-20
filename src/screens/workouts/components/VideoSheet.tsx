import React, { RefObject } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { YouTubeVideo } from '../../../services/youtubeService';
import { sheetProps } from '../../../components/Sheet';
import { colors } from '../../../theme';
import { styles } from './../styles';

type VideoAction = {
  label: string;
  Icon: React.FC<SvgProps>;
  onPress: () => void;
};

type Props = {
  sheetRef: RefObject<BottomSheetModal | null>;
  video: YouTubeVideo | null;
  actions: VideoAction[];
};

export function VideoSheet({ sheetRef, video, actions }: Props) {
  return (
    <BottomSheetModal ref={sheetRef} {...sheetProps()}>
      <BottomSheetView style={styles.sheet}>
        {video && (
          <>
            <Text style={styles.sheetTitle}>{video.title}</Text>
            <Text style={styles.videoChannel}>{video.channelTitle}</Text>

            <View style={styles.actionsRow}>
              {actions.map(action => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.action}
                  onPress={action.onPress}
                >
                  <View style={styles.actionCircle}>
                    <action.Icon
                      width={24}
                      height={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.actionText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
