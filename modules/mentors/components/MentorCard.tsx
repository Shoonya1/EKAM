/**
 * MentorCard — Mentor list card component
 * Shows avatar initials circle, name, tagline, category badge, save icon
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';
import { Mentor, CATEGORY_COLORS } from '../types';

interface MentorCardProps {
  mentor: Mentor;
  isSaved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}

export default function MentorCard({ mentor, isSaved, onPress, onToggleSave }: MentorCardProps) {
  const accentColor = mentor.colorHex;
  const categoryColor = CATEGORY_COLORS[mentor.category] ?? Colors.textTertiary;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: accentColor + '22', borderColor: accentColor }]}>
        <Text style={[styles.avatarText, { color: accentColor }]}>{mentor.avatarInitials}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{mentor.name}</Text>
        <Text style={styles.tagline} numberOfLines={2}>{mentor.tagline}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '22' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {mentor.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.statsText}>
            {mentor.books.length} books · {mentor.ideas.length} ideas
          </Text>
        </View>
      </View>

      {/* Save Button */}
      <Pressable onPress={onToggleSave} hitSlop={12} style={styles.saveBtn}>
        <Text style={[styles.saveIcon, isSaved && { color: Colors.primary }]}>
          {isSaved ? '\u2665' : '\u2661'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Elevation.subtle,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceContainer,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontFamily: Typography.headlineMd.fontFamily,
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  tagline: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
  statsText: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
  },
  saveBtn: {
    padding: Spacing.xs,
  },
  saveIcon: {
    fontSize: 24,
    color: Colors.textTertiary,
  },
});
