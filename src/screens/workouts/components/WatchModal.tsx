import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { GradientBackground } from '../../../components/Gradient';
import CloseIcon from '../../../assets/icons/close.svg';
import { colors } from '../../../theme';
import { styles } from './../styles';

type Props = {
  url: string;
  title?: string;
  onClose: () => void;
};

export function WatchModal({ url, title, onClose }: Props) {
  return (
    <Modal animationType="slide" visible={url !== ''} onRequestClose={onClose}>
      <GradientBackground>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle} numberOfLines={1}>
            {title}
          </Text>
          <TouchableOpacity style={styles.webClose} onPress={onClose}>
            <CloseIcon width={22} height={22} color={colors.text} />
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: url }}
          style={styles.webView}
          allowsFullscreenVideo
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              style={styles.loader}
              size="large"
              color={colors.primary}
            />
          )}
        />
      </GradientBackground>
    </Modal>
  );
}
