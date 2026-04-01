/**
 * EKAM Wellness Hub — Main Screen
 * Three pillars: Body (green), Spirit (violet), Nutrition (teal)
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';
import { useStore } from '../../../core/store/useStore';
import { useWellnessStore } from '../../../modules/wellness/store';
import WorkoutCard from '../../../modules/wellness/components/WorkoutCard';
import MeditationTimer from '../../../modules/wellness/components/MeditationTimer';
import NutritionLogger from '../../../modules/wellness/components/NutritionLogger';

const PILLAR_COLORS = {
  body: '#10B981',
  spirit: '#A855F7',
  nutrition: '#14B8A6',
} as const;

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type ActiveSheet = 'workout' | 'meditate' | 'nutrition' | null;

export default function WellnessScreen() {
  const router = useRouter();
  const rewardAction = useStore((s) => s.rewardAction);
  const wellnessStore = useWellnessStore();

  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null);

  useEffect(() => {
    wellnessStore.loadState();
  }, []);

  const todayWorkouts = wellnessStore.getTodayWorkoutCount();
  const todayMeditation = wellnessStore.getTodayMeditationMinutes();
  const todayCalories = wellnessStore.getTodayCalories();
  const weeklyActivity = wellnessStore.getWeeklyActivity();
  const maxActivity = Math.max(...weeklyActivity, 1);
  const stats = wellnessStore.getStats();

  const handleWorkoutComplete = () => {
    rewardAction('wellness.completeWorkout');
    setActiveSheet(null);
  };

  const handleMeditationComplete = (durationSeconds: number) => {
    wellnessStore.logMeditation('mindfulness', durationSeconds);
    rewardAction('wellness.meditate');
    setActiveSheet(null);
  };

  const handleNutritionLog = () => {
    rewardAction('wellness.logNutrition');
    setActiveSheet(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.screenTitle}>Wellness</Text>
        <Text style={styles.screenSubtitle}>Body, Spirit & Nutrition</Text>

        {/* Three Pillar Cards */}
        <View style={styles.pillarRow}>
          <TouchableOpacity
            style={[styles.pillarCard, { borderColor: PILLAR_COLORS.body }]}
            onPress={() => setActiveSheet('workout')}
            activeOpacity={0.7}
          >
            <Text style={styles.pillarEmoji}>💪</Text>
            <Text style={[styles.pillarLabel, { color: PILLAR_COLORS.body }]}>Body</Text>
            <Text style={styles.pillarStat}>{stats.workoutsCompleted}</Text>
            <Text style={styles.pillarStatLabel}>workouts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pillarCard, { borderColor: PILLAR_COLORS.spirit }]}
            onPress={() => setActiveSheet('meditate')}
            activeOpacity={0.7}
          >
            <Text style={styles.pillarEmoji}>🧘</Text>
            <Text style={[styles.pillarLabel, { color: PILLAR_COLORS.spirit }]}>Spirit</Text>
            <Text style={styles.pillarStat}>{stats.meditationMinutes}</Text>
            <Text style={styles.pillarStatLabel}>min</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pillarCard, { borderColor: PILLAR_COLORS.nutrition }]}
            onPress={() => setActiveSheet('nutrition')}
            activeOpacity={0.7}
          >
            <Text style={styles.pillarEmoji}>🥗</Text>
            <Text style={[styles.pillarLabel, { color: PILLAR_COLORS.nutrition }]}>Nutrition</Text>
            <Text style={styles.pillarStat}>{stats.nutritionLogsCount}</Text>
            <Text style={styles.pillarStatLabel}>logs</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Today</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: PILLAR_COLORS.body }]}>
                {todayWorkouts}
              </Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: PILLAR_COLORS.spirit }]}>
                {todayMeditation}
              </Text>
              <Text style={styles.summaryLabel}>Min Meditation</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: PILLAR_COLORS.nutrition }]}>
                {todayCalories}
              </Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: PILLAR_COLORS.body + '22' }]}
            onPress={() => setActiveSheet('workout')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>🏋️</Text>
            <Text style={[styles.actionLabel, { color: PILLAR_COLORS.body }]}>
              Start Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: PILLAR_COLORS.spirit + '22' }]}
            onPress={() => setActiveSheet('meditate')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>🕊️</Text>
            <Text style={[styles.actionLabel, { color: PILLAR_COLORS.spirit }]}>
              Meditate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: PILLAR_COLORS.nutrition + '22' }]}
            onPress={() => setActiveSheet('nutrition')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>🍽️</Text>
            <Text style={[styles.actionLabel, { color: PILLAR_COLORS.nutrition }]}>
              Log Food
            </Text>
          </TouchableOpacity>
        </View>

        {/* Body Analyzer Link */}
        <TouchableOpacity
          style={styles.bodyAnalyzerLink}
          onPress={() => router.push('/wellness/body-analyzer')}
          activeOpacity={0.7}
        >
          <Text style={styles.bodyAnalyzerEmoji}>📐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bodyAnalyzerTitle}>Body Analyzer</Text>
            <Text style={styles.bodyAnalyzerSub}>Track composition & trends</Text>
          </View>
          <Text style={styles.bodyAnalyzerArrow}>{'\u203A'}</Text>
        </TouchableOpacity>

        {/* Weekly Activity Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartContainer}>
            {weeklyActivity.map((value, index) => {
              const barHeight = Math.max((value / maxActivity) * 100, 4);
              return (
                <View key={index} style={styles.chartBarWrapper}>
                  <View style={styles.chartBarTrack}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${barHeight}%`,
                          backgroundColor:
                            value > 0 ? Colors.pillarWellness : Colors.surfaceContainerHigh,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{DAY_LABELS[index]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Workouts */}
        {wellnessStore.workoutHistory.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Workouts</Text>
            {wellnessStore.workoutHistory.slice(0, 3).map((workout) => (
              <WorkoutCard key={workout.id + workout.completedAt} workout={workout} />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Workout Modal */}
      <Modal
        visible={activeSheet === 'workout'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveSheet(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Start Workout</Text>
            <TouchableOpacity onPress={() => setActiveSheet(null)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          <WorkoutCard
            workout={{
              id: Date.now().toString(),
              name: 'Quick Workout',
              category: 'strength',
              duration: 30,
              difficulty: 'intermediate',
              exercises: [
                { name: 'Push-ups', sets: 3, reps: 15, duration: 0 },
                { name: 'Squats', sets: 3, reps: 20, duration: 0 },
                { name: 'Plank', sets: 3, reps: 1, duration: 60 },
                { name: 'Burpees', sets: 3, reps: 10, duration: 0 },
              ],
            }}
            onComplete={handleWorkoutComplete}
            expanded
          />
        </View>
      </Modal>

      {/* Meditation Modal */}
      <Modal
        visible={activeSheet === 'meditate'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveSheet(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Meditation</Text>
            <TouchableOpacity onPress={() => setActiveSheet(null)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          <MeditationTimer onComplete={handleMeditationComplete} />
        </View>
      </Modal>

      {/* Nutrition Modal */}
      <Modal
        visible={activeSheet === 'nutrition'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveSheet(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Nutrition</Text>
            <TouchableOpacity onPress={() => setActiveSheet(null)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          <NutritionLogger
            onLog={(meal, foods) => {
              wellnessStore.logNutrition(meal, foods);
              handleNutritionLog();
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
  },
  screenTitle: {
    ...Typography.displaySm,
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  // Pillar Cards
  pillarRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  pillarCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Elevation.card,
  },
  pillarEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  pillarLabel: {
    ...Typography.labelMd,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  pillarStat: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
  },
  pillarStatLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },

  // Summary
  summaryCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Elevation.subtle,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    ...Typography.headlineLg,
  },
  summaryLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.outlineVariant,
  },

  // Section
  sectionTitle: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionLabel: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },

  // Chart
  chartCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Elevation.subtle,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    gap: Spacing.xs,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  chartBarTrack: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: BorderRadius.sm,
    minHeight: 4,
  },
  chartLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },

  // Body Analyzer Link
  bodyAnalyzerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(72, 191, 227, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(72, 191, 227, 0.25)',
  },
  bodyAnalyzerEmoji: {
    fontSize: 28,
  },
  bodyAnalyzerTitle: {
    ...Typography.titleSm,
    color: '#48BFE3',
  },
  bodyAnalyzerSub: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
  },
  bodyAnalyzerArrow: {
    fontSize: 24,
    color: '#48BFE3',
  },

  // Recent
  recentSection: {
    marginBottom: Spacing.lg,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
  },
  modalClose: {
    ...Typography.titleSm,
    color: Colors.primary,
  },
});
