/**
 * GlowCard — Pressable card wrapper with optional glow shadow
 */

import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Elevation } from '../core/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlowCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  glowColor?: string;
  style?: ViewStyle;
  selected?: boolean;
  disabled?: boolean;
}

export default function GlowCard({
  children,
  onPress,
  glowColor = Colors.primary,
  style,
  selected = false,
  disabled = false,
}: GlowCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        selected && { ...Elevation.glow(glowColor), borderColor: glowColor, borderWidth: 1 },
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  disabled: {
    opacity: 0.5,
  },
});
