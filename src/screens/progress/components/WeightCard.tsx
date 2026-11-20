import React from 'react';
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { WeightRecord } from '../../../store/FitnessStore';
import Svg, {
  Circle,
  G,
  Line,
  Polyline,
  Text as SvgText,
} from 'react-native-svg';
import { GradientText } from '../../../components/Gradient';
import { colors } from '../../../theme';
import { styles } from './../styles';

const CHART_HEIGHT = 170;
const PAD_LEFT = 38;
const PAD_RIGHT = 16;
const PAD_TOP = 12;
const PAD_BOTTOM = 26;

type Props = {
  currentWeight: number;
  targetWeight: number;
  startWeight: number;
  history: WeightRecord[];
  onAdd: () => void;
};

export const WeightCard = observer(function WeightCard({
  currentWeight,
  targetWeight,
  startWeight,
  history,
  onAdd,
}: Props) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const allWeights = [
    ...history.map(item => item.weight),
    startWeight,
    targetWeight,
  ];
  const minWeight = Math.min(...allWeights) - 1;
  const maxWeight = Math.max(...allWeights) + 1;

  const chartWidth = width - 74;
  const chartBottom = CHART_HEIGHT - PAD_BOTTOM;
  const innerWidth = chartWidth - PAD_LEFT - PAD_RIGHT;

  const getX = (index: number) =>
    history.length === 1
      ? PAD_LEFT + innerWidth / 2
      : PAD_LEFT + (innerWidth * index) / (history.length - 1);
  const getY = (weight: number) =>
    PAD_TOP +
    ((maxWeight - weight) / (maxWeight - minWeight)) * (chartBottom - PAD_TOP);

  const chartLines = [
    { weight: startWeight, color: colors.textMuted, opacity: 0.4, width: 1 },
    { weight: targetWeight, color: colors.success, opacity: 1, width: 1.5 },
  ];
  const diff = +(currentWeight - targetWeight).toFixed(1);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{t('progress.weight')}</Text>
        <TouchableOpacity style={styles.smallButton} onPress={onAdd}>
          <Text style={styles.smallButtonText}>{t('progress.addWeight')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weightRow}>
        <View style={styles.weightBox}>
          <Text style={styles.subText}>{t('progress.current')}</Text>
          <GradientText style={styles.bigNumber}>
            {`${currentWeight} ${t('common.kg')}`}
          </GradientText>
        </View>
        <View style={styles.weightBox}>
          <Text style={styles.subText}>
            {diff > 0
              ? t('progress.toLose')
              : diff < 0
              ? t('progress.toGain')
              : t('progress.reached')}
          </Text>
          <GradientText style={styles.bigNumber}>
            {`${Math.abs(diff)} ${t('common.kg')}`}
          </GradientText>
        </View>
      </View>

      {history.length > 0 && (
        <Svg width={chartWidth} height={CHART_HEIGHT} style={styles.chart}>
          {chartLines.map(item => (
            <G key={item.color}>
              <Line
                x1={PAD_LEFT}
                x2={chartWidth - PAD_RIGHT}
                y1={getY(item.weight)}
                y2={getY(item.weight)}
                stroke={item.color}
                strokeOpacity={item.opacity}
                strokeWidth={item.width}
                strokeDasharray="6 4"
              />
              <SvgText
                x={0}
                y={getY(item.weight) + 4}
                fontSize={11}
                fill={item.color}
              >
                {item.weight}
              </SvgText>
            </G>
          ))}

          <Polyline
            points={history
              .map((item, index) => `${getX(index)},${getY(item.weight)}`)
              .join(' ')}
            fill="none"
            stroke={colors.primary}
            strokeWidth={3}
            strokeLinejoin="round"
          />

          {history.map((item, index) => (
            <G key={item.date}>
              <Circle
                cx={getX(index)}
                cy={getY(item.weight)}
                r={5}
                fill={colors.surface}
                stroke={colors.primary}
                strokeWidth={3}
              />
              <SvgText
                x={getX(index)}
                y={CHART_HEIGHT - 6}
                fontSize={10}
                fill={colors.textMuted}
                textAnchor="middle"
              >
                {`${item.date.slice(8)}.${item.date.slice(5, 7)}`}
              </SvgText>
            </G>
          ))}
        </Svg>
      )}
    </View>
  );
});
