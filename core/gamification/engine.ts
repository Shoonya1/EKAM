/**
 * EKAM RPG Engine — Core game logic
 * Handles XP, leveling, HP, coins, streaks, and EKAM token rewards
 */

import {
  Character,
  Skill,
  Difficulty,
  DEFAULT_RANKS,
  STREAK_MULTIPLIERS,
  EKAM_DAILY_CAP,
} from './types';

const DIFFICULTY_CONFIG: Record<Difficulty, { initialExp: number; growthRate: number }> = {
  easy: { initialExp: 500, growthRate: 0.1 },
  normal: { initialExp: 800, growthRate: 0.25 },
  hardcore: { initialExp: 800, growthRate: 0.4 },
};

export function createCharacter(name: string, avatar: string, difficulty: Difficulty): Character {
  const config = DIFFICULTY_CONFIG[difficulty];
  return {
    name,
    avatar,
    difficulty,
    level: 1,
    exp: 0,
    expToNextLevel: config.initialExp,
    hp: 1000,
    maxHp: 1000,
    coins: 0,
    ekamTokens: 0,
  };
}

export function addExp(character: Character, amount: number): Character {
  let { exp, level, expToNextLevel } = character;
  const config = DIFFICULTY_CONFIG[character.difficulty];
  exp += amount;

  while (exp >= expToNextLevel) {
    exp -= expToNextLevel;
    level += 1;
    expToNextLevel = Math.round(expToNextLevel * (1 + config.growthRate));
  }

  return { ...character, exp, level, expToNextLevel };
}

export function addSkillExp(skill: Skill, amount: number): Skill {
  let { exp, level, expToNextLevel } = skill;
  exp += amount;

  while (exp >= expToNextLevel) {
    exp -= expToNextLevel;
    level += 1;
    expToNextLevel = Math.round(expToNextLevel * 1.2);
  }

  return { ...skill, exp, level, expToNextLevel };
}

export function damageHp(character: Character, amount: number): Character {
  const hp = Math.max(0, character.hp - amount);
  return { ...character, hp };
}

export function healHp(character: Character, amount: number): Character {
  const hp = Math.min(character.maxHp, character.hp + amount);
  return { ...character, hp };
}

export function addCoins(character: Character, amount: number): Character {
  return { ...character, coins: character.coins + amount };
}

export function spendCoins(character: Character, amount: number): Character | null {
  if (character.coins < amount) return null;
  return { ...character, coins: character.coins - amount };
}

export function addEkamTokens(
  character: Character,
  amount: number,
  dailyEarned: number
): { character: Character; actualAmount: number } {
  const remaining = Math.max(0, EKAM_DAILY_CAP - dailyEarned);
  const actualAmount = Math.min(amount, remaining);
  return {
    character: { ...character, ekamTokens: character.ekamTokens + actualAmount },
    actualAmount,
  };
}

export function getStreakMultiplier(streakDays: number): number {
  const thresholds = Object.entries(STREAK_MULTIPLIERS)
    .map(([days, mult]) => ({ days: Number(days), mult }))
    .sort((a, b) => b.days - a.days);

  for (const { days, mult } of thresholds) {
    if (streakDays >= days) return mult;
  }
  return 1.0;
}

export function getCurrentRank(level: number) {
  const ranks = [...DEFAULT_RANKS].sort((a, b) => b.minLevel - a.minLevel);
  return ranks.find((r) => level >= r.minLevel) ?? DEFAULT_RANKS[0];
}

export function getNextRank(level: number) {
  const sorted = [...DEFAULT_RANKS].sort((a, b) => a.minLevel - b.minLevel);
  return sorted.find((r) => r.minLevel > level);
}

export function respawn(character: Character): Character {
  return {
    ...character,
    hp: character.maxHp,
    exp: 0,
    coins: 0,
  };
}

export function isCharacterDead(character: Character): boolean {
  return character.hp <= 0;
}

export function journalWordsToExp(wordCount: number, ratio: number = 10): number {
  return Math.floor(wordCount / ratio);
}

export function getPeharBonus(completedInWindow: boolean): number {
  return completedInWindow ? 1.5 : 1.0;
}

export function createDefaultSkills(): Skill[] {
  return [
    { id: 'mind', name: 'Mind', pillar: 'mind', level: 1, exp: 0, expToNextLevel: 100, icon: '🧠' },
    { id: 'discipline', name: 'Discipline', pillar: 'discipline', level: 1, exp: 0, expToNextLevel: 100, icon: '⚔️' },
    { id: 'wellness', name: 'Wellness', pillar: 'wellness', level: 1, exp: 0, expToNextLevel: 100, icon: '💪' },
    { id: 'wisdom', name: 'Wisdom', pillar: 'wisdom', level: 1, exp: 0, expToNextLevel: 100, icon: '📖' },
    { id: 'wealth', name: 'Wealth', pillar: 'wealth', level: 1, exp: 0, expToNextLevel: 100, icon: '💰' },
  ];
}
