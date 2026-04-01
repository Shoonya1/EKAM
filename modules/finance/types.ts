/**
 * Finance Module Types — Six Jars Budgeting System
 * Based on T. Harv Eker's money management system
 */

export interface Jar {
  id: string;
  name: string;
  emoji: string;
  color: string;
  percentage: number;
  balance: number;
}

export interface Transaction {
  id: string;
  jarId: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export const JAR_COLORS = {
  necessities: '#48BFE3',
  freedom: '#F2C35B',
  education: '#9D4EDD',
  longTermSavings: '#10B981',
  play: '#FF6B6B',
  give: '#FAB0FF',
} as const;

export const DEFAULT_JARS: Jar[] = [
  {
    id: 'necessities',
    name: 'Necessities',
    emoji: '🏠',
    color: JAR_COLORS.necessities,
    percentage: 55,
    balance: 0,
  },
  {
    id: 'freedom',
    name: 'Freedom',
    emoji: '🦅',
    color: JAR_COLORS.freedom,
    percentage: 10,
    balance: 0,
  },
  {
    id: 'education',
    name: 'Education',
    emoji: '📚',
    color: JAR_COLORS.education,
    percentage: 10,
    balance: 0,
  },
  {
    id: 'longTermSavings',
    name: 'Long-term Savings',
    emoji: '🏦',
    color: JAR_COLORS.longTermSavings,
    percentage: 10,
    balance: 0,
  },
  {
    id: 'play',
    name: 'Play',
    emoji: '🎮',
    color: JAR_COLORS.play,
    percentage: 10,
    balance: 0,
  },
  {
    id: 'give',
    name: 'Give',
    emoji: '💝',
    color: JAR_COLORS.give,
    percentage: 5,
    balance: 0,
  },
];
