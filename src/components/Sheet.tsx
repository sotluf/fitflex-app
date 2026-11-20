import React from 'react';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { colors } from '../theme';

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

export const sheetProps = () => ({
  backdropComponent: renderBackdrop,
  backgroundStyle: { backgroundColor: colors.surface },
  handleIndicatorStyle: { backgroundColor: colors.textMuted },
  keyboardBehavior: 'interactive' as const,
  keyboardBlurBehavior: 'restore' as const,
  android_keyboardInputMode: 'adjustResize' as const,
});
