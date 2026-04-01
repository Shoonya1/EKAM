/**
 * MeditationTimer — Start/pause/done timer with breathing guide
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';

const BREATHING_PHASES = [
  { label: 'Breathe In', duration: 4 },
  { label: 'Hold', duration: 4 },
  { label: 'Breathe Out', duration: 6 },
  { label: 'Hold', duration: 2 },
];

const VIOLET = '#A855F7';

interface MeditationTimerProps {
  onComplete: (durationSeconds: number) => void;
}

export default function MeditationTimer({ onComplete }: MeditationTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breathPhaseIndex, setBreathPhaseIndex] = useState(0);
  const [breathCountdown, setBreathCountdown] = useState(BREATHING_PHASES[0].duration);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Main timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Breathing cycle
  useEffect(() => {
    if (isRunning) {
      breathIntervalRef.current = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev <= 1) {
            setBreathPhaseIndex((pi) => {
              const next = (pi + 1) % BREATHING_PHASES.length;
              setBreathCountdown(BREATHING_PHASES[next].duration);
              return next;
            });
            return 0; // will be overwritten by setBreathCountdown above
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleDone = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    if (elapsedSeconds > 0) {
      onComplete(elapsedSeconds);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setBreathPhaseIndex(0);
    setBreathCountdown(BREATHING_PHASES[0].duration);
  };

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPhase = BREATHING_PHASES[breathPhaseIndex];

  return (
    <View style={styles.container}>
      {/* Timer Display */}
      <View style={styles.timerRing}>
        <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        <Text style={styles.timerSubtext}>
          {isRunning ? 'Session Active' : elapsedSeconds > 0 ? 'Paused' : 'Ready'}
        </Text>
      </View>

      {/* Breathing Guide */}
      <View style={styles.breathingCard}>
        <Text style={styles.breathingTitle}>Breathing Guide</Text>
        <Text style={styles.breathingPhase}>{currentPhase.label}</Text>
        <Text style={styles.breathingCountdown}>
          {isRunning ? breathCountdown : '--'}
        </Text>
        <View style={styles.breathingDots}>
          {BREATHING_PHASES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.breathingDot,
                i === breathPhaseIndex && isRunning && styles.breathingDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {elapsedSeconds > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleStartPause}
          activeOpacity={0.7}
        >
          <Text style={styles.mainButtonText}>
            {isRunning ? 'Pause' : elapsedSeconds > 0 ? 'Resume' : 'Start'}
          </Text>
        </TouchableOpacity>

        {elapsedSeconds > 0 && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            activeOpacity={0.7}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Duration Presets */}
      {elapsedSeconds === 0 && !isRunning && (
        <View style={styles.presetsRow}>
          {[5, 10, 15, 20].map((mins) => (
            <TouchableOpacity key={mins} style={styles.presetChip} activeOpacity={0.7}>
              <Text style={styles.presetText}>{mins} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },

  // Timer
  timerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: VIOLET,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Elevation.glow(VIOLET),
  },
  timerText: {
    ...Typography.displayLg,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  timerSubtext: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },

  // Breathing
  breathingCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.xl,
    ...Elevation.subtle,
  },
  breathingTitle: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  breathingPhase: {
    ...Typography.headlineMd,
    color: VIOLET,
    marginBottom: Spacing.xs,
  },
  breathingCountdown: {
    ...Typography.displayMd,
    color: Colors.textPrimary,
  },
  breathingDots: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  breathingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  breathingDotActive: {
    backgroundColor: VIOLET,
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  mainButton: {
    backgroundColor: VIOLET,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    minWidth: 140,
    alignItems: 'center',
  },
  mainButtonText: {
    ...Typography.titleSm,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  resetButtonText: {
    ...Typography.titleSm,
    color: Colors.textSecondary,
  },
  doneButton: {
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  doneButtonText: {
    ...Typography.titleSm,
    color: '#FFFFFF',
  },

  // Presets
  presetsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  presetChip: {
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  presetText: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
  },
});
