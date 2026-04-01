/**
 * Mentors Module — Zustand Store
 * Manages mentors library with AsyncStorage persistence
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mentor, Book, MentorCategory } from './types';
import { SEED_MENTORS } from './data';

const STORAGE_KEY = '@ekam_mentors';

interface MentorsState {
  mentors: Mentor[];
  savedMentorIds: string[];

  // Actions
  saveMentor: (mentorId: string) => void;
  unsaveMentor: (mentorId: string) => void;
  addCustomMentor: (mentor: Omit<Mentor, 'id' | 'isCustom'>) => string;
  addIdea: (mentorId: string, idea: string) => void;
  addBook: (mentorId: string, book: Book) => void;

  // Queries
  searchMentors: (query: string) => Mentor[];
  filterByCategory: (category: MentorCategory) => Mentor[];

  // Persistence
  loadMentors: () => Promise<void>;
  _persist: () => Promise<void>;
}

export const useMentorsStore = create<MentorsState>((set, get) => ({
  mentors: [...SEED_MENTORS],
  savedMentorIds: [],

  saveMentor: (mentorId: string) => {
    set((s) => {
      if (s.savedMentorIds.includes(mentorId)) return s;
      return { savedMentorIds: [...s.savedMentorIds, mentorId] };
    });
    get()._persist();
  },

  unsaveMentor: (mentorId: string) => {
    set((s) => ({
      savedMentorIds: s.savedMentorIds.filter((id) => id !== mentorId),
    }));
    get()._persist();
  },

  addCustomMentor: (mentorData) => {
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const mentor: Mentor = {
      ...mentorData,
      id,
      isCustom: true,
    };
    set((s) => ({
      mentors: [...s.mentors, mentor],
      savedMentorIds: [...s.savedMentorIds, id],
    }));
    get()._persist();
    return id;
  },

  addIdea: (mentorId: string, idea: string) => {
    set((s) => ({
      mentors: s.mentors.map((m) =>
        m.id === mentorId ? { ...m, ideas: [...m.ideas, idea] } : m
      ),
    }));
    get()._persist();
  },

  addBook: (mentorId: string, book: Book) => {
    set((s) => ({
      mentors: s.mentors.map((m) =>
        m.id === mentorId ? { ...m, books: [...m.books, book] } : m
      ),
    }));
    get()._persist();
  },

  searchMentors: (query: string) => {
    const lower = query.toLowerCase().trim();
    if (!lower) return get().mentors;
    return get().mentors.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.tagline.toLowerCase().includes(lower) ||
        m.category.toLowerCase().includes(lower) ||
        m.ideas.some((idea) => idea.toLowerCase().includes(lower))
    );
  },

  filterByCategory: (category: MentorCategory) => {
    return get().mentors.filter((m) => m.category === category);
  },

  loadMentors: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge seed mentors with any stored custom mentors
        const storedIds = new Set((parsed.mentors ?? []).map((m: Mentor) => m.id));
        const seedNotStored = SEED_MENTORS.filter((s) => !storedIds.has(s.id));
        set({
          mentors: [...(parsed.mentors ?? SEED_MENTORS), ...seedNotStored],
          savedMentorIds: parsed.savedMentorIds ?? [],
        });
      }
    } catch {
      // Silently fail, use defaults
    }
  },

  _persist: async () => {
    try {
      const state = get();
      const toSave = {
        mentors: state.mentors,
        savedMentorIds: state.savedMentorIds,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Silently fail
    }
  },
}));
