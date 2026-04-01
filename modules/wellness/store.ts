/**
 * EKAM Wellness Zustand Store
 * Persisted state for workouts, meditation, and nutrition
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CompletedWorkout,
  MeditationSession,
  NutritionLog,
  DailyGoals,
  WellnessStats,
  FoodItem,
  MealType,
  MeditationType,
  Workout,
} from './types';

const STORAGE_KEY = '@ekam_wellness';

interface WellnessState {
  workoutHistory: CompletedWorkout[];
  meditationHistory: MeditationSession[];
  nutritionLogs: NutritionLog[];
  dailyGoals: DailyGoals;

  // Actions
  completeWorkout: (workout: Workout) => void;
  logMeditation: (type: MeditationType, durationSeconds: number) => void;
  logNutrition: (meal: MealType, foods: FoodItem[]) => void;
  updateDailyGoals: (goals: Partial<DailyGoals>) => void;

  // Computed
  getStats: () => WellnessStats;
  getTodayCalories: () => number;
  getTodayMeditationMinutes: () => number;
  getTodayWorkoutCount: () => number;
  getWeeklyActivity: () => number[];

  // Persistence
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export const useWellnessStore = create<WellnessState>((set, get) => ({
  workoutHistory: [],
  meditationHistory: [],
  nutritionLogs: [],
  dailyGoals: {
    calories: 2000,
    protein: 120,
    water: 8,
  },

  completeWorkout: (workout: Workout) => {
    const completed: CompletedWorkout = {
      ...workout,
      completedAt: new Date().toISOString(),
    };
    set((s) => ({
      workoutHistory: [completed, ...s.workoutHistory],
    }));
    get().saveState();
  },

  logMeditation: (type: MeditationType, durationSeconds: number) => {
    const session: MeditationSession = {
      id: Date.now().toString(),
      type,
      duration: durationSeconds,
      completedAt: new Date().toISOString(),
    };
    set((s) => ({
      meditationHistory: [session, ...s.meditationHistory],
    }));
    get().saveState();
  },

  logNutrition: (meal: MealType, foods: FoodItem[]) => {
    const totalCalories = foods.reduce((sum, f) => sum + f.calories * f.quantity, 0);
    const log: NutritionLog = {
      id: Date.now().toString(),
      date: getToday(),
      meal,
      foods,
      totalCalories,
    };
    set((s) => ({
      nutritionLogs: [log, ...s.nutritionLogs],
    }));
    get().saveState();
  },

  updateDailyGoals: (goals: Partial<DailyGoals>) => {
    set((s) => ({
      dailyGoals: { ...s.dailyGoals, ...goals },
    }));
    get().saveState();
  },

  getStats: (): WellnessStats => {
    const state = get();
    const totalMeditationSeconds = state.meditationHistory.reduce(
      (sum, s) => sum + s.duration,
      0
    );
    return {
      workoutsCompleted: state.workoutHistory.length,
      meditationMinutes: Math.round(totalMeditationSeconds / 60),
      nutritionLogsCount: state.nutritionLogs.length,
    };
  },

  getTodayCalories: (): number => {
    const today = getToday();
    return get()
      .nutritionLogs.filter((l) => l.date === today)
      .reduce((sum, l) => sum + l.totalCalories, 0);
  },

  getTodayMeditationMinutes: (): number => {
    const today = getToday();
    const seconds = get()
      .meditationHistory.filter((s) => s.completedAt.startsWith(today))
      .reduce((sum, s) => sum + s.duration, 0);
    return Math.round(seconds / 60);
  },

  getTodayWorkoutCount: (): number => {
    const today = getToday();
    return get().workoutHistory.filter((w) => w.completedAt.startsWith(today)).length;
  },

  getWeeklyActivity: (): number[] => {
    const state = get();
    const weekDates = getWeekDates();
    return weekDates.map((date) => {
      const workouts = state.workoutHistory.filter((w) =>
        w.completedAt.startsWith(date)
      ).length;
      const meditations = state.meditationHistory.filter((s) =>
        s.completedAt.startsWith(date)
      ).length;
      const meals = state.nutritionLogs.filter((l) => l.date === date).length;
      return workouts + meditations + meals;
    });
  },

  loadState: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          workoutHistory: parsed.workoutHistory ?? [],
          meditationHistory: parsed.meditationHistory ?? [],
          nutritionLogs: parsed.nutritionLogs ?? [],
          dailyGoals: parsed.dailyGoals ?? { calories: 2000, protein: 120, water: 8 },
        });
      }
    } catch {
      // Silently fail — defaults are fine
    }
  },

  saveState: async () => {
    const state = get();
    const toSave = {
      workoutHistory: state.workoutHistory,
      meditationHistory: state.meditationHistory,
      nutritionLogs: state.nutritionLogs,
      dailyGoals: state.dailyGoals,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  },
}));
