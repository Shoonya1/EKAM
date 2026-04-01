/**
 * EKAM Design System — Color Tokens
 * "The Digital Sanctuary" — Dark, editorial, gamified wellness
 */

export const Colors = {
  // Core backgrounds
  background: '#131317',
  surface: '#131317',
  surfaceContainerLowest: '#0E0E11',
  surfaceContainerLow: '#1B1B1F',
  surfaceContainer: '#201F23',
  surfaceContainerHigh: '#2A292D',
  surfaceContainerHighest: '#353438',
  surfaceBright: '#39393D',

  // Primary — Sacred Gold
  primary: '#F2C35B',
  primaryContainer: '#D4A843',
  primaryDim: '#EEC058',
  onPrimary: '#402D00',
  onPrimaryContainer: '#553E00',

  // Secondary — Astral Blue (Mind pillar)
  secondary: '#ADCBDA',
  secondaryContainer: '#304D5A',
  onSecondary: '#163440',
  onSecondaryContainer: '#9FBDCC',

  // Tertiary — Starlight Violet (Discipline pillar)
  tertiary: '#FAB0FF',
  tertiaryContainer: '#F184FF',
  onTertiary: '#570066',
  onTertiaryContainer: '#730086',

  // Text
  onBackground: '#E5E1E6',
  onSurface: '#E5E1E6',
  onSurfaceVariant: '#D2C5B1',
  textPrimary: '#E5E1E6',
  textSecondary: '#D2C5B1',
  textTertiary: '#9A8F7D',

  // Functional
  success: '#10B981',
  danger: '#FF7B00',
  error: '#FFB4AB',
  errorContainer: '#93000A',
  warning: '#F59E0B',

  // Outline
  outline: '#9A8F7D',
  outlineVariant: '#4E4636',

  // RPG-specific
  hp: '#FF7B00',
  xp: '#9D4EDD',
  coins: '#FBBF24',
  streak: '#FF6B6B',

  // Difficulty
  difficultyEasy: '#48BFE3',
  difficultyMedium: '#F59E0B',
  difficultyHard: '#FF7B00',

  // Pillar glows
  pillarMind: '#ADCBDA',
  pillarDiscipline: '#FAB0FF',
  pillarWellness: '#10B981',
  pillarWisdom: '#F2C35B',
  pillarWealth: '#48BFE3',

  // Inverse
  inverseSurface: '#E5E1E6',
  inverseOnSurface: '#303034',
  inversePrimary: '#795900',

  // Misc
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  glass: 'rgba(19, 19, 23, 0.7)',
} as const;

export type ColorToken = keyof typeof Colors;
