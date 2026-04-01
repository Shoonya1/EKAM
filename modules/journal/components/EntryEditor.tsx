/**
 * EntryEditor — Modal for adding/editing journal entries
 * Multiline text input, tag selector chips, Peher indicator
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { JournalTag, JOURNAL_TAGS, TAG_COLORS, TAG_LABELS, JournalEntry } from '../types';
import { getPeherForHour, Peher } from '../../../core/peher';

interface EntryEditorProps {
  visible: boolean;
  peher: Peher;
  entry?: JournalEntry | null; // null = new entry
  onSave: (text: string, tags: JournalTag[]) => void;
  onCancel: () => void;
}

export default function EntryEditor({ visible, peher, entry, onSave, onCancel }: EntryEditorProps) {
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<JournalTag[]>([]);

  useEffect(() => {
    if (visible) {
      setText(entry?.text ?? '');
      setSelectedTags(entry?.tags ?? []);
    }
  }, [visible, entry]);

  const toggleTag = (tag: JournalTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave(trimmed, selectedTags);
    setText('');
    setSelectedTags([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View style={styles.sheet}>
          {/* Peher indicator */}
          <View style={styles.peherBadge}>
            <View style={[styles.peherDot, { backgroundColor: peher.color }]} />
            <Text style={styles.peherLabel}>
              {peher.icon} {peher.name} — {peher.meaning}
            </Text>
          </View>

          <Text style={styles.heading}>
            {entry ? 'Edit Entry' : 'New Entry'}
          </Text>

          {/* Text input */}
          <ScrollView style={styles.inputScroll} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.textInput}
              placeholder="What's on your mind..."
              placeholderTextColor={Colors.textTertiary}
              value={text}
              onChangeText={setText}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          </ScrollView>

          {/* Tag selector */}
          <Text style={styles.tagLabel}>Tags</Text>
          <View style={styles.tagRow}>
            {JOURNAL_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: selected
                        ? TAG_COLORS[tag] + '33'
                        : Colors.surfaceContainerHigh,
                    },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: selected ? TAG_COLORS[tag] : Colors.textTertiary },
                    ]}
                  >
                    {TAG_LABELS[tag]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!text.trim()}
            >
              <Text style={[styles.saveText, !text.trim() && styles.saveTextDisabled]}>
                Save
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.surfaceContainerLow,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    maxHeight: '85%',
  },
  peherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  peherDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  peherLabel: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  heading: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputScroll: {
    maxHeight: 200,
    marginBottom: Spacing.md,
  },
  textInput: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 120,
  },
  tagLabel: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tagChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.lg,
  },
  cancelText: {
    ...Typography.titleSm,
    color: Colors.textSecondary,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.lg,
  },
  saveBtnDisabled: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  saveText: {
    ...Typography.titleSm,
    color: Colors.onPrimaryContainer,
  },
  saveTextDisabled: {
    color: Colors.textTertiary,
  },
});
