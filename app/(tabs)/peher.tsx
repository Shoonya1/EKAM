/**
 * Peher Screen — Enhanced Journal View
 * Horizontal date picker, expandable Peher sections, entry cards, FAB
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { PEHERS, getCurrentPeher, Peher } from '../../core/peher';
import { useJournalStore } from '../../modules/journal/store';
import { JournalEntry, JournalTag } from '../../modules/journal/types';
import EntryCard from '../../modules/journal/components/EntryCard';
import EntryEditor from '../../modules/journal/components/EntryEditor';

const GOLD = '#D4A843';
const SCREEN_WIDTH = Dimensions.get('window').width;

// Generate an array of dates around today for the horizontal picker
function generateDateRange(centerDate: Date, range: number = 14): Date[] {
  const dates: Date[] = [];
  for (let i = -range; i <= range; i++) {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDayLabel(date: Date): string {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const dateKey = formatDateKey(date);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  if (dateKey === todayKey) return 'Today';
  if (dateKey === formatDateKey(yesterday)) return 'Yesterday';
  if (dateKey === formatDateKey(tomorrowDate)) return 'Tomorrow';
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

function formatDateNumber(date: Date): string {
  return date.getDate().toString();
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function PeherScreen() {
  const currentPeher = getCurrentPeher();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedPehers, setExpandedPehers] = useState<Set<number>>(new Set([currentPeher.index]));
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorPeher, setEditorPeher] = useState<Peher>(currentPeher);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const dateListRef = useRef<FlatList>(null);
  const dates = generateDateRange(new Date());
  const selectedDateKey = formatDateKey(selectedDate);
  const isToday = selectedDateKey === formatDateKey(new Date());

  const {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    togglePin,
    getEntriesGroupedByPeher,
    loadEntries,
  } = useJournalStore();

  useEffect(() => {
    loadEntries();
  }, []);

  // Scroll date picker to center (today) on mount
  useEffect(() => {
    const todayIndex = dates.findIndex((d) => formatDateKey(d) === formatDateKey(new Date()));
    if (todayIndex >= 0 && dateListRef.current) {
      setTimeout(() => {
        dateListRef.current?.scrollToIndex({ index: todayIndex, animated: false, viewPosition: 0.5 });
      }, 100);
    }
  }, []);

  const groupedEntries = getEntriesGroupedByPeher(selectedDateKey);

  const togglePeherExpansion = (index: number) => {
    setExpandedPehers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const openEditorForPeher = (peher: Peher) => {
    setEditorPeher(peher);
    setEditingEntry(null);
    setEditorVisible(true);
  };

  const openEditorForEntry = (entry: JournalEntry, peher: Peher) => {
    setEditorPeher(peher);
    setEditingEntry(entry);
    setEditorVisible(true);
  };

  const handleSaveEntry = (text: string, tags: JournalTag[]) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, { text, tags });
    } else {
      const hour = editorPeher.startHour + 1; // Default to 1 hour into the peher
      addEntry(text, tags, hour, selectedDateKey);
    }
    setEditorVisible(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(entry.id) },
    ]);
  };

  const getEntryCountForPeher = (peherIndex: number): number => {
    return groupedEntries.get(peherIndex)?.length ?? 0;
  };

  // Date picker item
  const renderDateItem = ({ item: date }: { item: Date }) => {
    const dateKey = formatDateKey(date);
    const isSelected = dateKey === selectedDateKey;
    const isTodayDate = dateKey === formatDateKey(new Date());

    return (
      <Pressable
        style={[styles.dateItem, isSelected && styles.dateItemSelected]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={[styles.dateDayLabel, isSelected && styles.dateDayLabelSelected]}>
          {formatDayLabel(date)}
        </Text>
        <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
          {formatDateNumber(date)}
        </Text>
        {isTodayDate && <View style={styles.todayDot} />}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>Peher</Text>
        <Text style={styles.subtitle}>{formatMonthYear(selectedDate)}</Text>

        {/* Horizontal date picker */}
        <View style={styles.datePickerContainer}>
          <FlatList
            ref={dateListRef}
            data={dates}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => formatDateKey(item)}
            renderItem={renderDateItem}
            contentContainerStyle={styles.datePickerContent}
            getItemLayout={(_, index) => ({ length: 64, offset: 64 * index, index })}
          />
        </View>

        {/* Peher sections */}
        {PEHERS.map((peher) => {
          const isActive = isToday && peher.index === currentPeher.index;
          const isExpanded = expandedPehers.has(peher.index);
          const peherEntries = groupedEntries.get(peher.index) ?? [];
          const entryCount = peherEntries.length;

          return (
            <View key={peher.index} style={styles.peherSection}>
              {/* Peher header — tap to expand/collapse */}
              <Pressable
                style={[
                  styles.peherHeader,
                  isActive && styles.peherHeaderActive,
                ]}
                onPress={() => togglePeherExpansion(peher.index)}
                onLongPress={() => openEditorForPeher(peher)}
              >
                <View style={[styles.peherColorBar, { backgroundColor: peher.color }]} />

                <View style={styles.peherHeaderContent}>
                  <View style={styles.peherTitleRow}>
                    <Text style={[styles.peherIcon]}>{peher.icon}</Text>
                    <View style={styles.peherNameBlock}>
                      <Text
                        style={[
                          styles.peherName,
                          isActive && styles.peherNameActive,
                        ]}
                      >
                        {peher.name}
                      </Text>
                      <Text style={styles.peherMeaning}>
                        {peher.meaning} {'\u00B7'} {peher.timeLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.peherMeta}>
                    {entryCount > 0 && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{entryCount}</Text>
                      </View>
                    )}
                    {isActive && (
                      <View style={[styles.nowBadge, { backgroundColor: GOLD }]}>
                        <Text style={styles.nowBadgeText}>NOW</Text>
                      </View>
                    )}
                    <Text style={styles.chevron}>{isExpanded ? '\u25B2' : '\u25BC'}</Text>
                  </View>
                </View>
              </Pressable>

              {/* Expanded entries */}
              {isExpanded && (
                <View style={styles.peherEntries}>
                  {peherEntries.length === 0 ? (
                    <Pressable
                      style={styles.emptyPrompt}
                      onPress={() => openEditorForPeher(peher)}
                    >
                      <Text style={styles.emptyText}>
                        Tap to add an entry for {peher.name}
                      </Text>
                    </Pressable>
                  ) : (
                    <>
                      {peherEntries.map((entry) => (
                        <EntryCard
                          key={entry.id}
                          entry={entry}
                          onPress={() => openEditorForEntry(entry, peher)}
                          onTogglePin={() => togglePin(entry.id)}
                          onDelete={() => handleDeleteEntry(entry)}
                        />
                      ))}
                      <Pressable
                        style={styles.addInlineBtn}
                        onPress={() => openEditorForPeher(peher)}
                      >
                        <Text style={styles.addInlineText}>+ Add entry</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB — add entry for current Peher */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => openEditorForPeher(currentPeher)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      {/* Entry editor modal */}
      <EntryEditor
        visible={editorVisible}
        peher={editorPeher}
        entry={editingEntry}
        onSave={handleSaveEntry}
        onCancel={() => {
          setEditorVisible(false);
          setEditingEntry(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131317',
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    ...Typography.displaySm,
    color: GOLD,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyLg,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },

  // Date picker
  datePickerContainer: {
    marginBottom: Spacing.lg,
    marginHorizontal: -Spacing.lg,
  },
  datePickerContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  dateItem: {
    width: 60,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#1B1B1F',
  },
  dateItemSelected: {
    backgroundColor: GOLD + '22',
  },
  dateDayLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dateDayLabelSelected: {
    color: GOLD,
  },
  dateNumber: {
    ...Typography.titleMd,
    color: Colors.textSecondary,
  },
  dateNumberSelected: {
    color: GOLD,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: GOLD,
    marginTop: 4,
  },

  // Peher sections
  peherSection: {
    marginBottom: Spacing.sm,
  },
  peherHeader: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#1B1B1F',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  peherHeaderActive: {
    backgroundColor: '#201F23',
  },
  peherColorBar: {
    width: 4,
  },
  peherHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  peherTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  peherIcon: {
    fontSize: 20,
  },
  peherNameBlock: {
    flex: 1,
  },
  peherName: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
  },
  peherNameActive: {
    color: GOLD,
  },
  peherMeaning: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  peherMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  countBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: 'center',
  },
  countText: {
    ...Typography.labelSm,
    color: Colors.textSecondary,
  },
  nowBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  nowBadgeText: {
    ...Typography.labelSm,
    color: '#131317',
    fontWeight: '700',
  },
  chevron: {
    fontSize: 10,
    color: Colors.textTertiary,
  },

  // Expanded entries area
  peherEntries: {
    paddingLeft: Spacing.md,
    paddingTop: Spacing.sm,
  },
  emptyPrompt: {
    backgroundColor: '#1B1B1F',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
  },
  addInlineBtn: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  addInlineText: {
    ...Typography.labelMd,
    color: GOLD,
    textTransform: 'uppercase',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GOLD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  fabPressed: {
    backgroundColor: '#C09A3A',
    transform: [{ scale: 0.95 }],
  },
  fabIcon: {
    fontSize: 28,
    color: '#131317',
    fontWeight: '700',
    marginTop: -2,
  },
});
