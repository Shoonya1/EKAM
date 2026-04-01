/**
 * JarCard — Individual jar display card
 * Shows emoji, name, percentage, balance, and a spend progress bar
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { Jar } from '../types';

interface JarCardProps {
  jar: Jar;
  totalBalance: number;
}

export default function JarCard({ jar, totalBalance }: JarCardProps) {
  // Proportion of total balance held in this jar
  const proportion = totalBalance > 0 ? jar.balance / totalBalance : 0;

  return (
    <View style={[styles.card, { borderLeftColor: jar.color, borderLeftWidth: 3 }]}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.emoji}>{jar.emoji}</Text>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{jar.percentage}%</Text>
        </View>
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>
        {jar.name}
      </Text>

      {/* Balance */}
      <Text style={[styles.balance, { color: jar.color }]}>
        {formatCurrency(jar.balance)}
      </Text>

      {/* Progress bar — proportion of total balance */}
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${Math.min(proportion * 100, 100)}%`,
              backgroundColor: jar.color,
            },
          ]}
        />
      </View>
    </View>
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `\u20B9${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `\u20B9${(amount / 1000).toFixed(1)}K`;
  }
  return `\u20B9${amount.toFixed(0)}`;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  percentBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  percentText: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  name: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  balance: {
    ...Typography.titleMd,
  },
  barTrack: {
    height: 4,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
