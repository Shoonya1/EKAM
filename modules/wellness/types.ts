/**
 * EKAM Wellness Module — Type Definitions
 * Covers Body (workouts), Spirit (meditation), Nutrition (food tracking)
 */

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration: number; // seconds
}

export type WorkoutCategory = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'yoga';
export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Workout {
  id: string;
  name: string;
  category: WorkoutCategory;
  duration: number; // minutes
  difficulty: WorkoutDifficulty;
  exercises: Exercise[];
}

export interface CompletedWorkout extends Workout {
  completedAt: string; // ISO date
}

export type MeditationType = 'breathing' | 'mindfulness' | 'body_scan' | 'gratitude' | 'focus';

export interface MeditationSession {
  id: string;
  type: MeditationType;
  duration: number; // seconds
  completedAt: string; // ISO date
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  quantity: number;
}

export interface NutritionLog {
  id: string;
  date: string; // YYYY-MM-DD
  meal: MealType;
  foods: FoodItem[];
  totalCalories: number;
}

export interface DailyGoals {
  calories: number;
  protein: number; // grams
  water: number;   // glasses
}

export interface WellnessStats {
  workoutsCompleted: number;
  meditationMinutes: number;
  nutritionLogsCount: number;
}
