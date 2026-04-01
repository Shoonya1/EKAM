/**
 * EKAM RPG Engine — Type Definitions
 * Unified gamification system across all modules
 */

export type Difficulty = 'easy' | 'normal' | 'hardcore';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type HabitType = 'good' | 'bad';
export type Pillar = 'mind' | 'discipline' | 'wellness' | 'wisdom' | 'wealth';

export interface Character {
  name: string;
  avatar: string;
  difficulty: Difficulty;
  masterObjective?: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  hp: number;
  maxHp: number;
  coins: number;
  ekamTokens: number;
}

export interface Skill {
  id: string;
  name: string;
  pillar: Pillar;
  level: number;
  exp: number;
  expToNextLevel: number;
  icon: string;
}

export interface RankTier {
  name: string;
  emoji: string;
  minLevel: number;
}

export interface Habit {
  id: string;
  title: string;
  type: HabitType;
  relatedSkillId: string;
  expReward: number;
  coinReward: number;
  hpPenalty: number;
  streak: number;
  lastCheckIn?: string;
}

export interface Task {
  id: string;
  title: string;
  difficulty: TaskDifficulty;
  completed: boolean;
  targetPehar?: number;
  relatedSkillId?: string;
  createdAt: string;
}

export interface PeharLog {
  id: string;
  date: string;
  peharIndex: number;
  content: string;
  wordCount: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  costType: 'coins' | 'ekam';
  effect: 'heal' | 'xpBoost' | 'cosmetic' | 'streakFreeze';
  effectValue: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Module-specific action rewards
export interface ActionReward {
  exp: number;
  coins: number;
  skillId?: string;
  ekamTokens?: number;
}

export const MODULE_REWARDS: Record<string, ActionReward> = {
  // Journal (Peher)
  'journal.logIdea': { exp: 10, coins: 5, skillId: 'wisdom' },
  'journal.write100Words': { exp: 20, coins: 10, skillId: 'wisdom' },
  // Finance (SixJars)
  'finance.allocateIncome': { exp: 30, coins: 0, skillId: 'wealth' },
  'finance.stayBudget': { exp: 50, coins: 25, skillId: 'discipline' },
  // Wellness (Triveni)
  'wellness.completeWorkout': { exp: 75, coins: 35, skillId: 'wellness', ekamTokens: 10 },
  'wellness.meditate': { exp: 30, coins: 15, skillId: 'wellness', ekamTokens: 5 },
  'wellness.logNutrition': { exp: 20, coins: 10, skillId: 'wellness', ekamTokens: 8 },
  // Mentors
  'mentors.addMentor': { exp: 15, coins: 5, skillId: 'wisdom' },
  'mentors.addIdea': { exp: 10, coins: 5, skillId: 'wisdom' },
  'mentors.completeBook': { exp: 100, coins: 50, skillId: 'wisdom', ekamTokens: 25 },
  // Quest (Habits/Tasks)
  'quest.completeHabit': { exp: 20, coins: 10 },
  'quest.completeTaskEasy': { exp: 20, coins: 10 },
  'quest.completeTaskMedium': { exp: 50, coins: 25 },
  'quest.completeTaskHard': { exp: 100, coins: 50 },
  // Streaks
  'streak.7day': { exp: 100, coins: 50, ekamTokens: 0 },
  'streak.30day': { exp: 500, coins: 200, ekamTokens: 0 },
  'streak.100day': { exp: 2000, coins: 1000, ekamTokens: 0 },
};

export const DEFAULT_RANKS: RankTier[] = [
  { name: 'Novice', emoji: '🌱', minLevel: 1 },
  { name: 'Apprentice', emoji: '⚡', minLevel: 5 },
  { name: 'Adept', emoji: '🔥', minLevel: 15 },
  { name: 'Warrior', emoji: '⚔️', minLevel: 30 },
  { name: 'Master', emoji: '👑', minLevel: 50 },
  { name: 'Champion', emoji: '🏆', minLevel: 100 },
  { name: 'Legend', emoji: '⭐', minLevel: 200 },
  { name: 'Mythic', emoji: '💎', minLevel: 500 },
];

export const STREAK_MULTIPLIERS = {
  7: 1.2,
  30: 1.5,
  100: 2.0,
  365: 3.0,
} as const;

export const EKAM_DAILY_CAP = 1000;
