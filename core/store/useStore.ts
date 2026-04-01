/**
 * EKAM Unified Zustand Store
 * Central state management for the entire app
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Character,
  Skill,
  Habit,
  Task,
  PeharLog,
  StreakData,
  HabitType,
  TaskDifficulty,
  MODULE_REWARDS,
} from '../gamification/types';
import {
  createCharacter,
  addExp,
  addSkillExp,
  addCoins,
  spendCoins,
  damageHp,
  healHp,
  createDefaultSkills,
  getStreakMultiplier,
  journalWordsToExp,
} from '../gamification/engine';

type UserState = 'logged_out' | 'guest' | 'authenticated';

interface AppState {
  // Auth
  userState: UserState;

  // Character
  character: Character;
  skills: Skill[];

  // Habits
  habits: Habit[];

  // Tasks
  tasks: Task[];

  // Journal (Peher)
  peharLogs: PeharLog[];

  // Streaks
  streakData: StreakData;

  // Daily tracking
  dailyEkamEarned: number;

  // App state
  isLoading: boolean;
  hasCompletedOnboarding: boolean;

  // Auth actions
  loginAsGuest: () => void;
  loginWithOnboarding: (params: {
    name: string;
    avatar: string;
    difficulty: import('../gamification/types').Difficulty;
    masterObjective: string;
    initialHabits?: Array<{
      title: string;
      type: import('../gamification/types').HabitType;
      skillId: string;
    }>;
  }) => void;
  logout: () => void;

  // Character actions
  rewardAction: (actionKey: string) => void;

  // Habit actions
  addHabit: (title: string, type: HabitType, skillId: string, expReward: number, coinReward: number, hpPenalty: number) => void;
  checkInHabit: (habitId: string) => void;
  removeHabit: (habitId: string) => void;

  // Task actions
  addTask: (title: string, difficulty: TaskDifficulty, targetPehar?: number) => void;
  completeTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;

  // Journal actions
  savePeharLog: (date: string, peharIndex: number, content: string, wordCount: number) => void;

  // Market actions
  buyItem: (cost: number, healAmount: number) => boolean;

  // Streak
  updateStreak: () => void;

  // Persistence
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

const STORAGE_KEY = '@ekam_state';

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  userState: 'logged_out',
  character: createCharacter('Seeker', '🧘', 'normal'),
  skills: createDefaultSkills(),
  habits: [],
  tasks: [],
  peharLogs: [],
  streakData: { currentStreak: 0, longestStreak: 0 },
  dailyEkamEarned: 0,
  isLoading: true,
  hasCompletedOnboarding: false,

  // Auth
  loginAsGuest: () => {
    set({ userState: 'guest' });
    get().saveState();
  },

  loginWithOnboarding: ({ name, avatar, difficulty, masterObjective, initialHabits }) => {
    const character = createCharacter(name, avatar, difficulty);
    const habits: Habit[] = (initialHabits ?? []).map((h) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      title: h.title,
      type: h.type,
      relatedSkillId: h.skillId,
      expReward: h.type === 'good' ? 20 : 0,
      coinReward: h.type === 'good' ? 10 : 0,
      hpPenalty: h.type === 'bad' ? 15 : 0,
      streak: 0,
    }));
    set({
      userState: 'guest',
      character: { ...character, masterObjective },
      skills: createDefaultSkills(),
      habits,
      hasCompletedOnboarding: true,
    });
    get().saveState();
  },

  logout: () => {
    set({
      userState: 'logged_out',
      character: createCharacter('Seeker', '🧘', 'normal'),
      skills: createDefaultSkills(),
      habits: [],
      tasks: [],
      peharLogs: [],
      streakData: { currentStreak: 0, longestStreak: 0 },
      hasCompletedOnboarding: false,
    });
    AsyncStorage.removeItem(STORAGE_KEY);
  },

  // Unified reward system
  rewardAction: (actionKey: string) => {
    const reward = MODULE_REWARDS[actionKey];
    if (!reward) return;

    const state = get();
    const streakMult = getStreakMultiplier(state.streakData.currentStreak);
    const expGain = Math.round(reward.exp * streakMult);
    const coinGain = Math.round(reward.coins * streakMult);

    let character = addExp(state.character, expGain);
    character = addCoins(character, coinGain);

    let skills = [...state.skills];
    if (reward.skillId) {
      skills = skills.map((s) =>
        s.id === reward.skillId ? addSkillExp(s, expGain) : s
      );
    }

    if (reward.ekamTokens && reward.ekamTokens > 0) {
      const remaining = Math.max(0, 1000 - state.dailyEkamEarned);
      const actual = Math.min(reward.ekamTokens, remaining);
      character = { ...character, ekamTokens: character.ekamTokens + actual };
      set({ dailyEkamEarned: state.dailyEkamEarned + actual });
    }

    set({ character, skills });
    get().saveState();
  },

  // Habits
  addHabit: (title, type, skillId, expReward, coinReward, hpPenalty) => {
    const habit: Habit = {
      id: Date.now().toString(),
      title,
      type,
      relatedSkillId: skillId,
      expReward,
      coinReward,
      hpPenalty,
      streak: 0,
    };
    set((s) => ({ habits: [...s.habits, habit] }));
    get().saveState();
  },

  checkInHabit: (habitId: string) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    if (habit.lastCheckIn === today) return;

    let character = state.character;
    let skills = [...state.skills];

    if (habit.type === 'good') {
      character = addExp(character, habit.expReward);
      character = addCoins(character, habit.coinReward);
      skills = skills.map((s) =>
        s.id === habit.relatedSkillId ? addSkillExp(s, habit.expReward) : s
      );
    } else {
      character = damageHp(character, habit.hpPenalty);
    }

    const habits = state.habits.map((h) =>
      h.id === habitId
        ? { ...h, lastCheckIn: today, streak: h.lastCheckIn === getPreviousDate(today) ? h.streak + 1 : 1 }
        : h
    );

    set({ character, skills, habits });
    get().saveState();
  },

  removeHabit: (habitId: string) => {
    set((s) => ({ habits: s.habits.filter((h) => h.id !== habitId) }));
    get().saveState();
  },

  // Tasks
  addTask: (title, difficulty, targetPehar) => {
    const task: Task = {
      id: Date.now().toString(),
      title,
      difficulty,
      completed: false,
      targetPehar,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ tasks: [...s.tasks, task] }));
    get().saveState();
  },

  completeTask: (taskId: string) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    const rewardKey = `quest.completeTask${task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}`;
    get().rewardAction(rewardKey);

    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
    }));
    get().saveState();
  },

  removeTask: (taskId: string) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }));
    get().saveState();
  },

  // Journal
  savePeharLog: (date, peharIndex, content, wordCount) => {
    const existing = get().peharLogs.find(
      (l) => l.date === date && l.peharIndex === peharIndex
    );

    const newWordCount = existing ? wordCount - existing.wordCount : wordCount;
    if (newWordCount > 0) {
      const expFromWords = journalWordsToExp(newWordCount);
      if (expFromWords > 0) {
        get().rewardAction('journal.logIdea');
      }
    }

    set((s) => {
      const logs = existing
        ? s.peharLogs.map((l) =>
            l.date === date && l.peharIndex === peharIndex
              ? { ...l, content, wordCount }
              : l
          )
        : [
            ...s.peharLogs,
            { id: Date.now().toString(), date, peharIndex, content, wordCount },
          ];
      return { peharLogs: logs };
    });
    get().saveState();
  },

  // Market
  buyItem: (cost: number, healAmount: number) => {
    const result = spendCoins(get().character, cost);
    if (!result) return false;
    const character = healHp(result, healAmount);
    set({ character });
    get().saveState();
    return true;
  },

  // Streak
  updateStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    set((s) => {
      const { lastActiveDate, currentStreak, longestStreak } = s.streakData;
      const yesterday = getPreviousDate(today);

      if (lastActiveDate === today) return {};

      const newStreak = lastActiveDate === yesterday ? currentStreak + 1 : 1;
      return {
        streakData: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, longestStreak),
          lastActiveDate: today,
        },
      };
    });
    get().saveState();
  },

  // Persistence
  loadState: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ ...parsed, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  saveState: async () => {
    const state = get();
    const toSave = {
      userState: state.userState,
      character: state.character,
      skills: state.skills,
      habits: state.habits,
      tasks: state.tasks,
      peharLogs: state.peharLogs,
      streakData: state.streakData,
      dailyEkamEarned: state.dailyEkamEarned,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  },
}));

function getPreviousDate(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
