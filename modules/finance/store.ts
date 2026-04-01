/**
 * Finance Zustand Store — Six Jars Budgeting
 * Persisted independently to AsyncStorage
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Jar, Transaction, DEFAULT_JARS } from './types';

const STORAGE_KEY = '@ekam_finance';

interface FinanceState {
  jars: Jar[];
  transactions: Transaction[];
  totalIncome: number;

  // Actions
  allocateIncome: (amount: number) => void;
  addExpense: (jarId: string, amount: number, description: string) => void;
  updateJarPercentage: (jarId: string, percentage: number) => void;
  getJarBalance: (jarId: string) => number;
  getTotalBalance: () => number;
  getJarTransactions: (jarId: string) => Transaction[];

  // Persistence
  loadFinanceState: () => Promise<void>;
  saveFinanceState: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  jars: DEFAULT_JARS.map((j) => ({ ...j })),
  transactions: [],
  totalIncome: 0,

  allocateIncome: (amount: number) => {
    const state = get();
    const now = new Date().toISOString();

    const newTransactions: Transaction[] = [];
    const updatedJars = state.jars.map((jar) => {
      const allocation = Math.round((amount * jar.percentage) / 100 * 100) / 100;
      newTransactions.push({
        id: `${Date.now()}_${jar.id}`,
        jarId: jar.id,
        amount: allocation,
        description: `Income allocation (${jar.percentage}%)`,
        date: now,
        type: 'income',
      });
      return { ...jar, balance: jar.balance + allocation };
    });

    set({
      jars: updatedJars,
      transactions: [...newTransactions, ...state.transactions],
      totalIncome: state.totalIncome + amount,
    });
    get().saveFinanceState();
  },

  addExpense: (jarId: string, amount: number, description: string) => {
    const state = get();
    const now = new Date().toISOString();

    const transaction: Transaction = {
      id: Date.now().toString(),
      jarId,
      amount,
      description,
      date: now,
      type: 'expense',
    };

    const updatedJars = state.jars.map((jar) =>
      jar.id === jarId ? { ...jar, balance: jar.balance - amount } : jar
    );

    set({
      jars: updatedJars,
      transactions: [transaction, ...state.transactions],
    });
    get().saveFinanceState();
  },

  updateJarPercentage: (jarId: string, percentage: number) => {
    set((s) => ({
      jars: s.jars.map((jar) =>
        jar.id === jarId ? { ...jar, percentage } : jar
      ),
    }));
    get().saveFinanceState();
  },

  getJarBalance: (jarId: string) => {
    const jar = get().jars.find((j) => j.id === jarId);
    return jar?.balance ?? 0;
  },

  getTotalBalance: () => {
    return get().jars.reduce((sum, jar) => sum + jar.balance, 0);
  },

  getJarTransactions: (jarId: string) => {
    return get().transactions.filter((t) => t.jarId === jarId);
  },

  loadFinanceState: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          jars: parsed.jars ?? DEFAULT_JARS,
          transactions: parsed.transactions ?? [],
          totalIncome: parsed.totalIncome ?? 0,
        });
      }
    } catch {
      // Silently fail, use defaults
    }
  },

  saveFinanceState: async () => {
    const state = get();
    const toSave = {
      jars: state.jars,
      transactions: state.transactions,
      totalIncome: state.totalIncome,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  },
}));
