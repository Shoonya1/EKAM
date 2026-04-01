/**
 * EntryCard — Reusable journal entry card
 * Shows text preview (2 lines), time, tag chips, pin star
 * Subtle left border colored by Peher
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { JournalEntry, TAG_COLORS, TAG_LABELS } from '../types';
import { getPeherForHour } from '../../../core/peher';

interface EntryCardProps {
  entry: JournalEntry;
  onPress?: () => void;
  onTogglePin?: () => void;
  onDelete?: () => void;
}

export default function EntryCard({ entry, onPress, onTogglePin, onDelete }: EntryCardProps) {
  const peher = getPeherForHour(entry.hour);
  const time = new Date(entry.timestamp);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: peher.color },
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.time}>{timeStr}</Text>
        <View style={styles.headerRight}>
          {onDelete && (
            <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
              <Text style={styles.deleteIcon}>x</Text>
            </Pressable>
          )}
          {onTogglePin && (
            <Pressable onPress={onTogglePin} hitSlop={8}>
              <Text style={[styles.pinIcon, entry.pinned && styles.pinIconActive]}>
                {entry.pinned ? '\u2605' : '\u2606'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <Text style={styles.text} numberOfLines={2}>
        {entry.text}
      </Text>

      {entry.tags.length > 0 && (
        <View style={styles.tagRow}>
          {entry.tags.map((tag) => (
            <View key={tag} style={[styles.tagChip, { backgroundColor: TAG_COLORS[tag] + '22' }]}>
              <Text style={[styles.tagText, { color: TAG_COLORS[tag] }]}>
                {TAG_LABELS[tag]}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.outline,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceContainer,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  time: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  pinIcon: {
    fontSize: 18,
    color: Colors.textTertiary,
  },
  pinIconActive: {
    color: Colors.primary,
  },
  deleteBtn: {
    paddingHorizontal: 4,
  },
  deleteIcon: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
  },
  text: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tagChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
});
