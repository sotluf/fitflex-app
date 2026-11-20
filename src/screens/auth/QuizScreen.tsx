import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import { fitnessStore } from '../../store/FitnessStore';
import { GradientBackground, GradientText } from '../../components/Gradient';
import { colors } from '../../theme';
import { styles } from './styles';

const STEPS = [
  {
    group: 'goals',
    question: 'quiz.goalQ',
    options: ['weight_loss', 'muscle_gain', 'endurance'],
  },
  {
    group: 'levels',
    question: 'quiz.levelQ',
    options: ['beginner', 'intermediate', 'advanced'],
  },
  {
    group: 'genders',
    question: 'quiz.genderQ',
    options: ['male', 'female', 'other'],
  },
];

export default function QuizScreen() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(['weight_loss', 'beginner', 'other']);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const isLastStep = step === STEPS.length;

  const selectOption = (value: string) => {
    setAnswers(
      answers.map((answer, index) => (index === step ? value : answer)),
    );
  };

  const handleSave = async () => {
    const weightNumber = parseFloat(weight.replace(',', '.'));
    const heightNumber = parseFloat(height.replace(',', '.'));

    if (
      !(weightNumber >= 20 && weightNumber <= 300) ||
      !(heightNumber >= 100 && heightNumber <= 250)
    ) {
      return showMessage({
        message: t('common.checkData'),
        description: t('quiz.range'),
        type: 'warning',
      });
    }

    const [goal, level, gender] = answers;
    await fitnessStore.savePreferences({
      goal,
      level,
      gender,
      weight: weightNumber,
      height: heightNumber,
    });
    showMessage({ message: t('quiz.ready'), type: 'success' });
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <GradientText style={styles.title}>{t('quiz.welcome')}</GradientText>
          <Text style={styles.subtitle}>
            {t('quiz.step', { step: step + 1, total: STEPS.length + 1 })}
          </Text>

          <View style={styles.progressRow}>
            {[0, 1, 2, 3].map(number => (
              <View
                key={number}
                style={[
                  styles.progressStep,
                  number <= step && styles.progressStepDone,
                ]}
              />
            ))}
          </View>

          <View style={styles.card}>
            {isLastStep ? (
              <>
                <Text style={styles.label}>{t('quiz.weightLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('quiz.weightHint')}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.label}>{t('quiz.heightLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('quiz.heightHint')}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
              </>
            ) : (
              <>
                <Text style={styles.label}>{t(STEPS[step].question)}</Text>
                {STEPS[step].options.map(option => {
                  const isSelected = option === answers[step];
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.option,
                        isSelected && styles.optionSelected,
                      ]}
                      onPress={() => selectOption(option)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {t(`${STEPS[step].group}.${option}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>

          <View style={styles.navRow}>
            {step > 0 && (
              <TouchableOpacity
                style={styles.grayButton}
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.grayButtonText}>{t('common.back')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={isLastStep ? handleSave : () => setStep(step + 1)}
            >
              <Text style={styles.buttonText}>
                {isLastStep ? t('common.finish') : t('common.next')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
