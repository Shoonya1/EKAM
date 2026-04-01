/**
 * EKAM Body Analyzer — Zustand Store
 * Persisted body-composition measurements with trend analysis.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ekam_body';

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

export interface BodyMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  bodyFat: number; // percentage
  chest: number; // cm
  waist: number; // cm
  hip: number; // cm
}

export interface BodyTrend {
  weight: number; // delta (positive = gained)
  bodyFat: number;
  chest: number;
  waist: number;
  hip: number;
}

// ---------------------------------------------------------------
// Store
// ---------------------------------------------------------------

interface BodyState {
  measurements: BodyMeasurement[];

  // Actions
  addMeasurement: (m: Omit<BodyMeasurement, 'id' | 'date'>) => void;

  // Computed
  getLatest: () => BodyMeasurement | null;
  getTrend: () => BodyTrend | null;
  getMeasurementCount: () => number;
  getLevel: () => number;

  // Persistence
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

export const useBodyStore = create<BodyState>((set, get) => ({
  measurements: [],

  addMeasurement: (m) => {
    const measurement: BodyMeasurement = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...m,
    };
    set((s) => ({
      measurements: [measurement, ...s.measurements],
    }));
    get().saveState();
  },

  getLatest: () => {
    const { measurements } = get();
    return measurements.length > 0 ? measurements[0] : null;
  },

  getTrend: () => {
    const { measurements } = get();
    if (measurements.length < 2) return null;

    const latest = measurements[0];

    // Find entry closest to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const targetDate = thirtyDaysAgo.toISOString().split('T')[0];

    let comparison = measurements[measurements.length - 1]; // oldest as fallback
    for (const m of measurements) {
      if (m.date <= targetDate) {
        comparison = m;
        break;
      }
    }

    return {
      weight: +(latest.weight - comparison.weight).toFixed(1),
      bodyFat: +(latest.bodyFat - comparison.bodyFat).toFixed(1),
      chest: +(latest.chest - comparison.chest).toFixed(1),
      waist: +(latest.waist - comparison.waist).toFixed(1),
      hip: +(latest.hip - comparison.hip).toFixed(1),
    };
  },

  getMeasurementCount: () => get().measurements.length,

  getLevel: () => {
    const count = get().measurements.length;
    if (count >= 100) return 5;
    if (count >= 50) return 4;
    if (count >= 20) return 3;
    if (count >= 10) return 2;
    return 1;
  },

  loadState: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ measurements: parsed.measurements ?? [] });
      }
    } catch {
      // Defaults are fine
    }
  },

  saveState: async () => {
    const { measurements } = get();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ measurements }));
  },
}));
