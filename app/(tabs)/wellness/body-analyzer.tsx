/**
 * EKAM Body Analyzer Screen
 * Body composition tracking with measurement logging and trend analysis.
 * Accent: Teal #48BFE3  |  Achievement gold: #D4A843
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';
import { useStore } from '../../../core/store/useStore';
import { useBodyStore, BodyTrend } from '../../../modules/wellness/body-store';

const TEAL = '#48BFE3';
const TEAL_DIM = 'rgba(72, 191, 227, 0.15)';
const GOLD = '#D4A843';

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: Colors.warning };
  if (bmi < 25) return { label: 'Normal', color: Colors.success };
  if (bmi < 30) return { label: 'Overweight', color: Colors.danger };
  return { label: 'Obese', color: Colors.error };
}

function trendArrow(delta: number, invertPositive = false): string {
  if (delta === 0) return '--';
  const isUp = delta > 0;
  const arrow = isUp ? '\u2191' : '\u2193'; // up / down unicode arrows
  const sign = isUp ? '+' : '';
  return `${arrow} ${sign}${delta}`;
}

export default function BodyAnalyzerScreen() {
  const router = useRouter();
  const rewardAction = useStore((s) => s.rewardAction);
  const bodyStore = useBodyStore();

  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');

  useEffect(() => {
    bodyStore.loadState();
  }, []);

  const latest = bodyStore.getLatest();
  const trend = bodyStore.getTrend();
  const level = bodyStore.getLevel();

  // Derived stats (use defaults when no data)
  const currentWeight = latest?.weight ?? 70;
  const currentBodyFat = latest?.bodyFat ?? 20;
  const heightM = 1.75; // Placeholder — would come from profile
  const bmi = +(currentWeight / (heightM * heightM)).toFixed(1);
  const bmiInfo = getBmiCategory(bmi);
  const muscleMass = +((currentWeight * (100 - currentBodyFat)) / 100).toFixed(1);
  const postureScore = Math.min(100, 60 + bodyStore.getMeasurementCount() * 2); // gamified

  const handleSave = () => {
    const w = parseFloat(weight);
    const bf = parseFloat(bodyFat);
    const ch = parseFloat(chest);
    const wa = parseFloat(waist);
    const hp = parseFloat(hip);

    if ([w, bf, ch, wa, hp].some((v) => isNaN(v) || v <= 0)) {
      Alert.alert('Invalid Input', 'Please enter valid positive numbers for all fields.');
      return;
    }

    bodyStore.addMeasurement({ weight: w, bodyFat: bf, chest: ch, waist: wa, hip: hp });
    rewardAction('wellness.logNutrition'); // reuse closest reward key
    setShowForm(false);
    setWeight('');
    setBodyFat('');
    setChest('');
    setWaist('');
    setHip('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.screenTitle}>Body Analyzer</Text>
              <Text style={styles.screenSubtitle}>Composition & Trends</Text>
            </View>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => Alert.alert('Coming Soon', 'Camera body scan will be available in a future update.')}
              activeOpacity={0.7}
            >
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>

          {/* Body Silhouette */}
          <View style={styles.silhouetteCard}>
            <Text style={styles.silhouetteTitle}>Body Overview</Text>
            <View style={styles.silhouetteContainer}>
              {/* Text-based body outline with measurement labels */}
              <View style={styles.silhouetteBody}>
                <Text style={styles.silhouetteHead}>O</Text>
                <Text style={styles.silhouetteLine}>|</Text>
                <View style={styles.silhouetteRow}>
                  <Text style={styles.measureLabel}>
                    {latest?.chest ?? '--'} cm
                  </Text>
                  <Text style={styles.silhouetteTorso}>/---\</Text>
                  <Text style={[styles.measureLabel, { textAlign: 'right' }]}>Chest</Text>
                </View>
                <View style={styles.silhouetteRow}>
                  <Text style={styles.measureLabel}>
                    {latest?.waist ?? '--'} cm
                  </Text>
                  <Text style={styles.silhouetteTorso}> |   | </Text>
                  <Text style={[styles.measureLabel, { textAlign: 'right' }]}>Waist</Text>
                </View>
                <View style={styles.silhouetteRow}>
                  <Text style={styles.measureLabel}>
                    {latest?.hip ?? '--'} cm
                  </Text>
                  <Text style={styles.silhouetteTorso}>\---/</Text>
                  <Text style={[styles.measureLabel, { textAlign: 'right' }]}>Hip</Text>
                </View>
                <View style={styles.silhouetteRow}>
                  <Text style={styles.silhouetteLegs}> /   \ </Text>
                </View>
                <View style={styles.silhouetteRow}>
                  <Text style={styles.silhouetteLegs}>/     \</Text>
                </View>
              </View>
            </View>
            <Text style={styles.silhouetteWeight}>
              {currentWeight} kg
            </Text>
          </View>

          {/* 2x2 Stat Cards */}
          <View style={styles.statGrid}>
            {/* Body Fat */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>BODY FAT</Text>
              <View style={styles.circleContainer}>
                <View style={[styles.circleOuter, { borderColor: TEAL }]}>
                  <Text style={styles.circleValue}>{currentBodyFat}%</Text>
                </View>
              </View>
              {trend && (
                <Text style={[styles.trendText, { color: trend.bodyFat <= 0 ? Colors.success : Colors.danger }]}>
                  {trendArrow(trend.bodyFat)}%
                </Text>
              )}
            </View>

            {/* Muscle Mass */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>MUSCLE MASS</Text>
              <Text style={styles.statValue}>{muscleMass}</Text>
              <Text style={styles.statUnit}>kg</Text>
              {trend && (
                <Text style={[styles.trendText, { color: trend.weight >= 0 && trend.bodyFat <= 0 ? Colors.success : Colors.textTertiary }]}>
                  {trendArrow(+(muscleMass - ((currentWeight - (trend?.weight ?? 0)) * (100 - (currentBodyFat - (trend?.bodyFat ?? 0))) / 100)).toFixed(1))} kg
                </Text>
              )}
            </View>

            {/* BMI */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>BMI SCORE</Text>
              <Text style={styles.statValue}>{bmi}</Text>
              <View style={[styles.bmiBadge, { backgroundColor: bmiInfo.color + '33' }]}>
                <Text style={[styles.bmiBadgeText, { color: bmiInfo.color }]}>
                  {bmiInfo.label}
                </Text>
              </View>
            </View>

            {/* Posture Score */}
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>POSTURE</Text>
              <Text style={styles.statValue}>{postureScore}</Text>
              <Text style={styles.statUnit}>/100</Text>
            </View>
          </View>

          {/* 30-Day Transformation */}
          {trend && (
            <View style={styles.transformCard}>
              <Text style={styles.sectionTitle}>30-Day Transformation</Text>
              <View style={styles.transformRow}>
                <TransformItem label="Weight" delta={trend.weight} unit="kg" invertPositive />
                <TransformItem label="Body Fat" delta={trend.bodyFat} unit="%" invertPositive />
                <TransformItem label="Waist" delta={trend.waist} unit="cm" invertPositive />
              </View>
              <View style={styles.transformRow}>
                <TransformItem label="Chest" delta={trend.chest} unit="cm" />
                <TransformItem label="Hip" delta={trend.hip} unit="cm" />
                <View style={{ flex: 1 }} />
              </View>
            </View>
          )}

          {/* Measurement Form Toggle */}
          <TouchableOpacity
            style={styles.logButton}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.7}
          >
            <Text style={styles.logButtonText}>
              {showForm ? 'Cancel' : 'Log Measurements'}
            </Text>
          </TouchableOpacity>

          {/* Input Form */}
          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>New Measurement</Text>

              <FormField label="Weight (kg)" value={weight} onChangeText={setWeight} />
              <FormField label="Body Fat (%)" value={bodyFat} onChangeText={setBodyFat} />
              <FormField label="Chest (cm)" value={chest} onChangeText={setChest} />
              <FormField label="Waist (cm)" value={waist} onChangeText={setWaist} />
              <FormField label="Hip (cm)" value={hip} onChangeText={setHip} />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
                <Text style={styles.saveButtonText}>Save & Earn EKAM</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Achievement Badge */}
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>
              {level >= 4 ? '\u2B50' : '\uD83D\uDCAA'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.achievementTitle}>Body Warrior</Text>
              <Text style={styles.achievementLevel}>Level {level}</Text>
            </View>
            <Text style={styles.achievementCount}>
              {bodyStore.getMeasurementCount()} logs
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ---------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------

function FormField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor={Colors.textTertiary}
        placeholder="0"
      />
    </View>
  );
}

function TransformItem({
  label,
  delta,
  unit,
  invertPositive = false,
}: {
  label: string;
  delta: number;
  unit: string;
  invertPositive?: boolean;
}) {
  const isPositive = delta > 0;
  // For weight/fat/waist, going down is good
  const isGood = invertPositive ? !isPositive : isPositive;
  const color = delta === 0 ? Colors.textTertiary : isGood ? Colors.success : Colors.danger;

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.transformLabel}>{label}</Text>
      <Text style={[styles.transformDelta, { color }]}>
        {trendArrow(delta)} {unit}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------
// Styles
// ---------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  screenTitle: {
    ...Typography.displaySm,
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  scanButton: {
    backgroundColor: TEAL_DIM,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: TEAL,
  },
  scanButtonText: {
    ...Typography.labelMd,
    color: TEAL,
    textTransform: 'uppercase',
  },

  // Silhouette
  silhouetteCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Elevation.subtle,
  },
  silhouetteTitle: {
    ...Typography.titleSm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  silhouetteContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  silhouetteBody: {
    alignItems: 'center',
  },
  silhouetteHead: {
    fontSize: 28,
    color: TEAL,
    fontWeight: '700',
  },
  silhouetteLine: {
    fontSize: 18,
    color: TEAL,
    lineHeight: 20,
  },
  silhouetteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  silhouetteTorso: {
    fontSize: 16,
    color: TEAL,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  silhouetteLegs: {
    fontSize: 16,
    color: TEAL,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  measureLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    width: 60,
  },
  silhouetteWeight: {
    ...Typography.headlineMd,
    color: TEAL,
    marginTop: Spacing.sm,
  },

  // 2x2 Grid
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    ...Elevation.subtle,
  },
  statLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  statValue: {
    ...Typography.displaySm,
    color: TEAL,
  },
  statUnit: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
  },
  trendText: {
    ...Typography.labelMd,
    marginTop: Spacing.xs,
  },

  // Circle (Body Fat)
  circleContainer: {
    marginVertical: Spacing.xs,
  },
  circleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TEAL_DIM,
  },
  circleValue: {
    ...Typography.titleLg,
    color: TEAL,
  },

  // BMI badge
  bmiBadge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginTop: Spacing.xs,
  },
  bmiBadgeText: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },

  // Transformation
  transformCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Elevation.subtle,
  },
  sectionTitle: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  transformRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  transformLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  transformDelta: {
    ...Typography.titleSm,
  },

  // Log button
  logButton: {
    backgroundColor: TEAL,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logButtonText: {
    ...Typography.titleMd,
    color: Colors.onPrimary,
  },

  // Form
  formCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: TEAL + '44',
  },
  formTitle: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  formField: {
    marginBottom: Spacing.md,
  },
  formLabel: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  formInput: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.bodyLg,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: TEAL,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    ...Typography.titleMd,
    color: Colors.onPrimary,
  },

  // Achievement
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: GOLD + '55',
    ...Elevation.subtle,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementTitle: {
    ...Typography.titleMd,
    color: GOLD,
  },
  achievementLevel: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
  },
  achievementCount: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
  },
});
