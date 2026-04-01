/**
 * WorkoutCard — Displays a workout with exercises and optional complete action
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';
import { Workout, CompletedWorkout } from '../types';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: Colors.difficultyEasy,
  intermediate: Colors.difficultyMedium,
  advanced: Colors.difficultyHard,
};

const CATEGORY_EMOJI: Record<string, string> = {
  strength: '🏋️',
  cardio: '🏃',
  flexibility: '🤸',
  hiit: '⚡',
  yoga: '🧘',
};

interface WorkoutCardProps {
  workout: Workout | CompletedWorkout;
  onComplete?: () => void;
  expanded?: boolean;
}

export default function WorkoutCard({ workout, onComplete, expanded = false }: WorkoutCardProps) {
  const isCompleted = 'completedAt' in workout;
  const difficultyColor = DIFFICULTY_COLORS[workout.difficulty] ?? Colors.textTertiary;
  const categoryEmoji = CATEGORY_EMOJI[workout.category] ?? '💪';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>{categoryEmoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.name}>{workout.name}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.difficulty, { color: difficultyColor }]}>
              {workout.difficulty.toUpperCase()}
            </Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.duration}>{workout.duration} min</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.category}>{workout.category}</Text>
          </View>
        </View>
        {isCompleted && <Text style={styles.completedBadge}>Done</Text>}
      </View>

      {/* Exercises */}
      {expanded && (
        <View style={styles.exerciseList}>
          {workout.exercises.map((ex, i) => (
            <View key={i} style={styles.exerciseRow}>
              <Text style={styles.exerciseIndex}>{i + 1}</Text>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {ex.duration > 0
                    ? `${ex.sets} x ${ex.duration}s`
                    : `${ex.sets} x ${ex.reps} reps`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Complete Button */}
      {onComplete && !isCompleted && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={onComplete}
          activeOpacity={0.7}
        >
          <Text style={styles.completeButtonText}>Complete Workout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    ...Elevation.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  name: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  difficulty: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
  metaDot: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.xs,
  },
  duration: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  category: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
    textTransform: 'capitalize',
  },
  completedBadge: {
    ...Typography.labelSm,
    color: '#10B981',
    backgroundColor: '#10B98122',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },

  // Exercises
  exerciseList: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    paddingTop: Spacing.md,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exerciseIndex: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
    width: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  exerciseDetail: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
  },

  // Complete
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  completeButtonText: {
    ...Typography.titleSm,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
