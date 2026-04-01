/**
 * EKAM Token — Deployment Configuration
 * Network settings and reward parameters for Polygon deployment.
 */

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const NETWORKS: Record<string, NetworkConfig> = {
  polygon: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  mumbai: {
    name: 'Polygon Mumbai Testnet',
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://mumbai.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  amoy: {
    name: 'Polygon Amoy Testnet',
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

// ---------------------------------------------------------------
// Contract deployment parameters
// ---------------------------------------------------------------

export const DEPLOY_PARAMS = {
  tokenName: 'EKAM Token',
  tokenSymbol: 'EKAM',
  maxSupply: '100000000', // 100 M (human-readable, not wei)
  decimals: 18,
  dailyRewardCap: '1000', // 1 000 EKAM per user per day
} as const;

// ---------------------------------------------------------------
// Activity reward amounts (mirrors core/gamification/types.ts MODULE_REWARDS)
// Amounts are in whole EKAM tokens (not wei).
// ---------------------------------------------------------------

export const ACTIVITY_REWARDS: Record<string, number> = {
  // Wellness (Triveni)
  'wellness.completeWorkout': 10,
  'wellness.meditate': 5,
  'wellness.logNutrition': 8,

  // Mentors
  'mentors.completeBook': 25,

  // Body Analyzer
  'bodyAnalyzer.logMeasurement': 5,
};

// ---------------------------------------------------------------
// Streak multipliers — basis points (10 000 = 1.0x)
// Match STREAK_MULTIPLIERS from core/gamification/types.ts
// ---------------------------------------------------------------

export const STREAK_MULTIPLIERS_BPS: Record<number, number> = {
  7: 12_000,   // 1.2x
  30: 15_000,  // 1.5x
  100: 20_000, // 2.0x
  365: 30_000, // 3.0x
};
