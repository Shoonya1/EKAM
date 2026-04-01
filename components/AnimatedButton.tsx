/**
 * AnimatedButton — Pressable button with spring scale animation
 */

import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../core/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
}

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  style,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.base,
        variantStyles.container,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {icon && <Text style={[styles.icon, variantStyles.text]}>{icon}</Text>}
      <Text style={[styles.text, variantStyles.text]}>{title}</Text>
    </AnimatedPressable>
  );
}

function getVariantStyles(variant: ButtonVariant): {
  container: ViewStyle;
  text: TextStyle;
} {
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: Colors.primaryContainer,
        },
        text: {
          color: Colors.onPrimaryContainer,
        },
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.outline,
        },
        text: {
          color: Colors.textPrimary,
        },
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
        },
        text: {
          color: Colors.primary,
        },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  text: {
    ...Typography.titleMd,
  },
  icon: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});
