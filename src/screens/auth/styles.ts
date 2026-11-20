import EStyleSheet from 'react-native-extended-stylesheet';
import { colors, common, fonts, radius } from '../../theme';

export const styles = EStyleSheet.create({
  flex: common.flex,
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontFamily: fonts.bold, fontSize: 32, textAlign: 'center' },
  subtitle: {
    ...common.subtitle,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  card: { ...common.card, padding: 20, marginBottom: 0 },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '$text',
    marginBottom: 14,
  },
  input: common.input,
  inputError: { borderColor: '$danger' },
  passwordInput: { paddingRight: 48 },
  eyeButton: { position: 'absolute', right: 14, top: 12 },
  ruleText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '$textMuted',
    marginBottom: 4,
  },
  button: { ...common.button, marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: common.buttonText,
  grayButton: { ...common.grayButton, flex: 1 },
  grayButtonText: common.grayButtonText,
  nextButton: { flex: 1, marginTop: 0 },
  smallText: {
    ...common.subtitle,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 14,
  },
  link: { fontFamily: fonts.semiBold, color: '$primary' },
  switchText: { fontSize: 14, marginTop: 22 },
  navRow: { ...common.row, marginTop: 24 },
  sheet: common.sheet,
  sheetTitle: common.sheetTitle,
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressStep: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '$ringTrack',
  },
  progressStepDone: { backgroundColor: '$primary' },
  option: {
    backgroundColor: '$surface',
    borderWidth: 1,
    borderColor: '$ringTrack',
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
  optionSelected: { borderColor: '$primary', backgroundColor: '$ringTrack' },
  optionText: { fontFamily: fonts.medium, fontSize: 15, color: '$text' },
  optionTextSelected: { color: '$primary' },
});

export const getHtmlStyles = () => ({
  body: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  p: { marginBottom: 12 },
  li: { marginBottom: 6 },
});
