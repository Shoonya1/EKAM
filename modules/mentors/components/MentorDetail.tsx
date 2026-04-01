/**
 * MentorDetail — Full mentor detail view
 * Large avatar, name, tagline, category, and three tabs: Books, Ideas, Recommendations
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';
import { Mentor, CATEGORY_COLORS, RECOMMENDATION_TYPE_LABELS } from '../types';

type DetailTab = 'books' | 'ideas' | 'recommendations';

interface MentorDetailProps {
  mentor: Mentor;
  isSaved: boolean;
  onToggleSave: () => void;
  onBack: () => void;
}

export default function MentorDetail({ mentor, isSaved, onToggleSave, onBack }: MentorDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('books');
  const accentColor = mentor.colorHex;
  const categoryColor = CATEGORY_COLORS[mentor.category] ?? Colors.textTertiary;

  const tabs: { key: DetailTab; label: string; count: number }[] = [
    { key: 'books', label: 'Books', count: mentor.books.length },
    { key: 'ideas', label: 'Ideas', count: mentor.ideas.length },
    { key: 'recommendations', label: 'Recs', count: mentor.recommendations.length },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </Pressable>
        <Pressable onPress={onToggleSave} hitSlop={12} style={styles.saveBtn}>
          <Text style={[styles.saveIcon, isSaved && { color: Colors.primary }]}>
            {isSaved ? '\u2665' : '\u2661'}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: accentColor + '22', borderColor: accentColor }]}>
            <Text style={[styles.avatarText, { color: accentColor }]}>{mentor.avatarInitials}</Text>
          </View>
          <Text style={styles.name}>{mentor.name}</Text>
          <Text style={styles.tagline}>{mentor.tagline}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '22' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {mentor.category.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label} ({tab.count})
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'books' && (
          <View style={styles.tabContent}>
            {mentor.books.length === 0 ? (
              <Text style={styles.emptyText}>No books added yet.</Text>
            ) : (
              mentor.books.map((book, idx) => (
                <View key={idx} style={[styles.bookCard, { borderLeftColor: accentColor }]}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookYear}>{book.year}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'ideas' && (
          <View style={styles.tabContent}>
            {mentor.ideas.length === 0 ? (
              <Text style={styles.emptyText}>No ideas captured yet.</Text>
            ) : (
              mentor.ideas.map((idea, idx) => (
                <View key={idx} style={[styles.ideaCard, { borderLeftColor: accentColor }]}>
                  <Text style={styles.ideaQuote}>{'\u201C'}</Text>
                  <Text style={styles.ideaText}>{idea}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'recommendations' && (
          <View style={styles.tabContent}>
            {mentor.recommendations.length === 0 ? (
              <Text style={styles.emptyText}>No recommendations yet.</Text>
            ) : (
              mentor.recommendations.map((rec, idx) => (
                <View key={idx} style={styles.recCard}>
                  <View style={[styles.recTypeBadge, { backgroundColor: accentColor + '22' }]}>
                    <Text style={[styles.recTypeText, { color: accentColor }]}>
                      {RECOMMENDATION_TYPE_LABELS[rec.type].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.recItem}>{rec.item}</Text>
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  backText: {
    fontSize: 28,
    color: Colors.textPrimary,
  },
  saveBtn: {
    padding: Spacing.xs,
  },
  saveIcon: {
    fontSize: 28,
    color: Colors.textTertiary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontFamily: Typography.displayMd.fontFamily,
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    ...Typography.displaySm,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...Typography.bodyLg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    ...Typography.labelMd,
    textTransform: 'uppercase',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  tabText: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: Colors.primary,
  },

  // Tab Content
  tabContent: {
    gap: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },

  // Books
  bookCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
  },
  bookTitle: {
    ...Typography.titleMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  bookYear: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
  },

  // Ideas
  ideaCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
  },
  ideaQuote: {
    fontFamily: Typography.displayLg.fontFamily,
    fontSize: 36,
    color: Colors.textTertiary,
    lineHeight: 36,
    marginBottom: -4,
  },
  ideaText: {
    ...Typography.bodyLg,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  // Recommendations
  recCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  recTypeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    minWidth: 64,
    alignItems: 'center',
  },
  recTypeText: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
  recItem: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    flex: 1,
  },
});
