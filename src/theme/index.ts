import EStyleSheet from 'react-native-extended-stylesheet';

const lightColors = {
  primary: '#788CE3',
  accent: '#A06BE0',
  success: '#4FB286',
  danger: '#E5484D',
  text: '#17243F',
  textMuted: '#667592',
  onPrimary: '#FFFFFF',
  surface: '#FFFFFF',
  card: 'rgba(255, 255, 255, 0.7)',
  cardBorder: 'rgba(255, 255, 255, 0.9)',
  ringTrack: 'rgba(120, 140, 227, 0.15)',
  gradientStart: '#F7F3E6',
  gradientMiddle: '#DCE8F1',
  gradientEnd: '#C9DBEA',
};

const darkColors = {
  primary: '#DFF478',
  accent: '#788CE3',
  success: '#6EE7A8',
  danger: '#FF7B7B',
  text: '#F7F3E6',
  textMuted: '#A9B6D0',
  onPrimary: '#17243F',
  surface: '#1E2D52',
  card: 'rgba(247, 243, 230, 0.08)',
  cardBorder: 'rgba(247, 243, 230, 0.14)',
  ringTrack: 'rgba(247, 243, 230, 0.12)',
  gradientStart: '#17243F',
  gradientMiddle: '#17243F',
  gradientEnd: '#17243F',
};

export const colors = { ...lightColors };

export function applyTheme(mode: string) {
  const palette = mode === 'dark' ? darkColors : lightColors;
  Object.assign(colors, palette);

  const variables: { [key: string]: string } = { $theme: mode };
  Object.entries(palette).forEach(([name, value]) => {
    variables['$' + name] = value;
  });
  EStyleSheet.build(variables);
}

export const fonts = {
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semiBold: 'Manrope-SemiBold',
  bold: 'Manrope-Bold',
};

export const radius = {
  md: 16,
  lg: 28,
  pill: 999,
};

export const common = {
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: 12 },
  title: { fontFamily: fonts.bold, fontSize: 30, marginBottom: 16 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: '$textMuted' },
  card: {
    backgroundColor: '$card',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '$cardBorder',
  },
  input: {
    backgroundColor: '$surface',
    borderWidth: 1,
    borderColor: '$ringTrack',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: '$text',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '$primary',
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { fontFamily: fonts.bold, fontSize: 15, color: '$onPrimary' },
  outlineButton: {
    borderWidth: 1,
    borderColor: '$primary',
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  outlineButtonText: { fontFamily: fonts.bold, fontSize: 15, color: '$primary' },
  grayButton: {
    borderWidth: 1,
    borderColor: '$textMuted',
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  grayButtonText: { fontFamily: fonts.bold, fontSize: 15, color: '$textMuted' },
  dangerButton: {
    borderWidth: 1,
    borderColor: '$danger',
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerButtonText: { fontFamily: fonts.bold, fontSize: 15, color: '$danger' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: '$ringTrack',
  },
  chipActive: { backgroundColor: '$primary' },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: '$text' },
  chipTextActive: { color: '$onPrimary' },
  sheet: { padding: 20, paddingBottom: 32 },
  sheetTitle: { fontFamily: fonts.bold, fontSize: 20, color: '$text', marginBottom: 12 },
  sheetText: { fontFamily: fonts.medium, fontSize: 15, color: '$text', marginBottom: 6 },
  emptyText: { fontFamily: fonts.regular, textAlign: 'center', color: '$textMuted', marginTop: 12 },
};