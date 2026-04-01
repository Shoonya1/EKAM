/**
 * ProgressBar — Animated progress bar with optional label and value display
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, BorderRadius } from '../core/theme';

interface ProgressBarProps {
  value: number; // 0–1
  color?: string;
  height?: number;
  label?: string;
  showValue?: boolean;
}

export default function ProgressBar({
  value,
  color = Colors.primary,
  height = 8,
  label,
  showValue = false,
}: ProgressBarProps) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withSpring(Math.min(1, Math.max(0, value)), {
      damping: 20,
      stiffness: 100,
    });
  }, [value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%` as any,
  }));

  return (
    <View style={styles.container}>
      {(label || showValue) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && (
            <Text style={styles.value}>{Math.round(value * 100)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: color, height, borderRadius: height / 2 },
            fillStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
  },
  value: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
  },
  track: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
