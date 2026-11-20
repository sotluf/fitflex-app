import React, { useRef } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '../theme';
import { ProfileMenuButton } from '../screens/profile';

const Masked: any = MaskedView;

function Gradient({
  list,
  endX,
  endY,
}: {
  list: string[];
  endX: number;
  endY: number;
}) {
  const name = useRef('gradient' + Math.random()).current;

  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <LinearGradient id={name} x1={0} y1={0} x2={endX} y2={endY}>
          {list.map((color, index) => (
            <Stop
              key={index}
              offset={index / (list.length - 1)}
              stopColor={color}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${name})`} />
    </Svg>
  );
}

export function GradientBackground({
  children,
  menu = false,
  tour = false,
}: {
  children: React.ReactNode;
  menu?: boolean;
  tour?: boolean;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.gradientEnd }}>
      <Gradient
        list={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
        endX={0.6}
        endY={1}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {children}
      </SafeAreaView>
      {menu && <ProfileMenuButton tour={tour} />}
    </View>
  );
}

export function GradientText({
  children,
  style,
}: {
  children: string;
  style?: TextStyle;
}) {
  return (
    <Masked
      maskElement={<Text style={[style, { color: '#000' }]}>{children}</Text>}
    >
      <View>
        <Gradient list={[colors.primary, colors.accent]} endX={1} endY={0} />
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </View>
    </Masked>
  );
}
