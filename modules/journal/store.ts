/**
 * Journal Module — Zustand Store
 * Manages journal entries with AsyncStorage persistence
 * Entries are grouped by Peher time blocks via getPeherForHour
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, JournalTag } from './types';
import { getPeherForHour, Peher } from '../../core/peher';

const STORAGE_KEY = '@ekam_journal';

interface JournalState {
  entries: JournalEntry[];

  addEntry: (text: string, tags: JournalTag[], hour?: number, dateKey?: string) => void;
  updateEntry: (id: string, updates: Partial<Pick<JournalEntry, 'text' | 'tags' | 'imageUrl'>>) => void;
  deleteEntry: (id: string) => void;
  togglePin: (id: string) => void;
  searchEntries: (query: string) => JournalEntry[];
  getEntriesForDate: (dateKey: string) => JournalEntry[];
  getEntriesGroupedByPeher: (dateKey: string) => Map<number, JournalEntry[]>;

  loadEntries: () => Promise<void>;
  _persist: () => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],

  addEntry: (text, tags, hour, dateKey) => {
    const now = new Date();
    const entry: JournalEntry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      text,
      tags,
      pinned: false,
      timestamp: now.toISOString(),
      hour: hour ?? now.getHours(),
      dateKey: dateKey ?? now.toISOString().split('T')[0],
    };
    set((s) => ({ entries: [entry, ...s.entries] }));
    get()._persist();
  },

  updateEntry: (id, updates) => {
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    get()._persist();
  },

  deleteEntry: (id) => {
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
    get()._persist();
  },

  togglePin: (id) => {
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? { ...e, pinned: !e.pinned } : e)),
    }));
    get()._persist();
  },

  searchEntries: (query) => {
    const lower = query.toLowerCase();
    return get().entries.filter(
      (e) =>
        e.text.toLowerCase().includes(lower) ||
        e.tags.some((t) => t.toLowerCase().includes(lower))
    );
  },

  getEntriesForDate: (dateKey) => {
    return get().entries.filter((e) => e.dateKey === dateKey);
  },

  getEntriesGroupedByPeher: (dateKey) => {
    const dayEntries = get().getEntriesForDate(dateKey);
    const grouped = new Map<number, JournalEntry[]>();

    for (const entry of dayEntries) {
      const peher = getPeherForHour(entry.hour);
      const existing = grouped.get(peher.index) ?? [];
      // Pinned entries first, then by timestamp descending
      existing.push(entry);
      grouped.set(peher.index, existing);
    }

    // Sort within each group: pinned first, then newest first
    for (const [key, entries] of grouped) {
      grouped.set(
        key,
        entries.sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        })
      );
    }

    return grouped;
  },

  loadEntries: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as JournalEntry[];
        set({ entries: parsed });
      }
    } catch {
      // Silently fail — entries will start empty
    }
  },

  _persist: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get().entries));
    } catch {
      // Silently fail
    }
  },
}));
