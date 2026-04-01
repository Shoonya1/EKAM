/**
 * Mentors Library Screen
 * Search, filter by category, browse mentor cards, add custom mentors
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';
import { useMentorsStore } from '../../../modules/mentors/store';
import { useStore } from '../../../core/store/useStore';
import { MentorCategory, MENTOR_CATEGORIES, CATEGORY_COLORS } from '../../../modules/mentors/types';
import MentorCard from '../../../modules/mentors/components/MentorCard';

export default function MentorsScreen() {
  const router = useRouter();
  const mentors = useMentorsStore((s) => s.mentors);
  const savedMentorIds = useMentorsStore((s) => s.savedMentorIds);
  const searchMentors = useMentorsStore((s) => s.searchMentors);
  const saveMentor = useMentorsStore((s) => s.saveMentor);
  const unsaveMentor = useMentorsStore((s) => s.unsaveMentor);
  const addCustomMentor = useMentorsStore((s) => s.addCustomMentor);
  const loadMentors = useMentorsStore((s) => s.loadMentors);
  const rewardAction = useStore((s) => s.rewardAction);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MentorCategory | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add mentor form state
  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState<MentorCategory>('Philosophy');

  useEffect(() => {
    loadMentors();
  }, []);

  const filteredMentors = useCallback(() => {
    let results = searchQuery ? searchMentors(searchQuery) : mentors;
    if (selectedCategory) {
      results = results.filter((m) => m.category === selectedCategory);
    }
    return results;
  }, [searchQuery, selectedCategory, mentors, searchMentors]);

  const handleToggleSave = useCallback(
    (mentorId: string) => {
      if (savedMentorIds.includes(mentorId)) {
        unsaveMentor(mentorId);
      } else {
        saveMentor(mentorId);
      }
    },
    [savedMentorIds, saveMentor, unsaveMentor]
  );

  const handleAddMentor = useCallback(() => {
    if (!newName.trim()) {
      Alert.alert('Name required', 'Please enter a mentor name.');
      return;
    }

    const initials = newName
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('');

    const accentColors = ['#9D4EDD', '#48BFE3', '#10B981', '#F59E0B', '#FF6B6B', '#FAB0FF', '#ADCBDA', '#FF7B00'];
    const colorHex = accentColors[Math.floor(Math.random() * accentColors.length)];

    addCustomMentor({
      name: newName.trim(),
      tagline: newTagline.trim() || 'My personal mentor',
      avatarInitials: initials,
      colorHex,
      category: newCategory,
      books: [],
      ideas: [],
      recommendations: [],
    });

    rewardAction('mentors.addMentor');

    setNewName('');
    setNewTagline('');
    setNewCategory('Philosophy');
    setShowAddModal(false);
  }, [newName, newTagline, newCategory, addCustomMentor, rewardAction]);

  const displayedMentors = filteredMentors();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </Pressable>
        <Text style={styles.title}>Mentors</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>{'\u2315'}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search mentors, ideas..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Text style={styles.clearIcon}>x</Text>
          </Pressable>
        )}
      </View>

      {/* Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContainer}
      >
        <Pressable
          style={[
            styles.chip,
            selectedCategory === null && styles.chipActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.chipText,
              selectedCategory === null && styles.chipTextActive,
            ]}
          >
            ALL
          </Text>
        </Pressable>
        {MENTOR_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          const catColor = CATEGORY_COLORS[cat];
          return (
            <Pressable
              key={cat}
              style={[
                styles.chip,
                isActive && { backgroundColor: catColor + '33' },
              ]}
              onPress={() => setSelectedCategory(isActive ? null : cat)}
            >
              <Text
                style={[
                  styles.chipText,
                  isActive && { color: catColor },
                ]}
              >
                {cat.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Mentor List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {displayedMentors.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{'📚'}</Text>
            <Text style={styles.emptyTitle}>No mentors found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : 'Add your first mentor'}
            </Text>
          </View>
        ) : (
          displayedMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              isSaved={savedMentorIds.includes(mentor.id)}
              onPress={() => router.push(`/(tabs)/mentors/${mentor.id}`)}
              onToggleSave={() => handleToggleSave(mentor.id)}
            />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      {/* Add Mentor Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Mentor</Text>

            <Text style={styles.inputLabel}>NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Marcus Aurelius"
              placeholderTextColor={Colors.textTertiary}
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.inputLabel}>TAGLINE</Text>
            <TextInput
              style={styles.input}
              placeholder="A short description..."
              placeholderTextColor={Colors.textTertiary}
              value={newTagline}
              onChangeText={setNewTagline}
            />

            <Text style={styles.inputLabel}>CATEGORY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.modalChipScroll}
            >
              {MENTOR_CATEGORIES.map((cat) => {
                const isActive = newCategory === cat;
                const catColor = CATEGORY_COLORS[cat];
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.chip,
                      isActive && { backgroundColor: catColor + '33' },
                      { marginRight: Spacing.xs },
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text style={[styles.chipText, isActive && { color: catColor }]}>
                      {cat.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => {
                  setShowAddModal(false);
                  setNewName('');
                  setNewTagline('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalSaveBtn} onPress={handleAddMentor}>
                <Text style={styles.modalSaveText}>Add Mentor</Text>
              </Pressable>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title: {
    ...Typography.headlineLg,
    color: Colors.textPrimary,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 20,
    color: Colors.textTertiary,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    height: 48,
  },
  clearIcon: {
    ...Typography.labelLg,
    color: Colors.textTertiary,
    padding: Spacing.xs,
  },

  // Chips
  chipScroll: {
    maxHeight: 44,
    marginBottom: Spacing.md,
  },
  chipContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
  },
  chipActive: {
    backgroundColor: Colors.primaryContainer + '33',
  },
  chipText: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  chipTextActive: {
    color: Colors.primary,
  },

  // List
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 96,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  fabPressed: {
    backgroundColor: Colors.primaryContainer,
  },
  fabIcon: {
    fontSize: 28,
    color: Colors.onPrimary,
    lineHeight: 30,
    fontWeight: '300',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surfaceContainerLow,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  modalTitle: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    height: 48,
  },
  modalChipScroll: {
    marginTop: Spacing.sm,
    maxHeight: 44,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
  },
  modalCancelText: {
    ...Typography.titleSm,
    color: Colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  modalSaveText: {
    ...Typography.titleSm,
    color: Colors.onPrimary,
  },
});
