/**
 * EKAM Typography System
 * Headlines: Noto Serif (editorial authority)
 * Body/Labels: Plus Jakarta Sans (clean precision)
 */

import { TextStyle } from 'react-native';

export const FontFamily = {
  serifRegular: 'NotoSerif_400Regular',
  serifMedium: 'NotoSerif_500Medium',
  serifSemiBold: 'NotoSerif_600SemiBold',
  serifBold: 'NotoSerif_700Bold',
  sansRegular: 'PlusJakartaSans_400Regular',
  sansMedium: 'PlusJakartaSans_500Medium',
  sansSemiBold: 'PlusJakartaSans_600SemiBold',
  sansBold: 'PlusJakartaSans_700Bold',
} as const;

type TypographyVariant = {
  fontSize: number;
  fontFamily: string;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
  letterSpacing?: number;
};

export const Typography: Record<string, TypographyVariant> = {
  // Display — Noto Serif (editorial headlines)
  displayLg: {
    fontSize: 40,
    fontFamily: FontFamily.serifBold,
    fontWeight: '700',
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  displayMd: {
    fontSize: 32,
    fontFamily: FontFamily.serifBold,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.25,
  },
  displaySm: {
    fontSize: 28,
    fontFamily: FontFamily.serifSemiBold,
    fontWeight: '600',
    lineHeight: 36,
  },

  // Headlines — Noto Serif
  headlineLg: {
    fontSize: 24,
    fontFamily: FontFamily.serifBold,
    fontWeight: '700',
    lineHeight: 32,
  },
  headlineMd: {
    fontSize: 20,
    fontFamily: FontFamily.serifSemiBold,
    fontWeight: '600',
    lineHeight: 28,
  },
  headlineSm: {
    fontSize: 18,
    fontFamily: FontFamily.serifMedium,
    fontWeight: '500',
    lineHeight: 24,
  },

  // Titles — Plus Jakarta Sans
  titleLg: {
    fontSize: 20,
    fontFamily: FontFamily.sansBold,
    fontWeight: '700',
    lineHeight: 28,
  },
  titleMd: {
    fontSize: 16,
    fontFamily: FontFamily.sansSemiBold,
    fontWeight: '600',
    lineHeight: 24,
  },
  titleSm: {
    fontSize: 14,
    fontFamily: FontFamily.sansSemiBold,
    fontWeight: '600',
    lineHeight: 20,
  },

  // Body — Plus Jakarta Sans
  bodyLg: {
    fontSize: 16,
    fontFamily: FontFamily.sansRegular,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontFamily: FontFamily.sansRegular,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySm: {
    fontSize: 12,
    fontFamily: FontFamily.sansRegular,
    fontWeight: '400',
    lineHeight: 16,
  },

  // Labels — Plus Jakarta Sans (ALL-CAPS museum label aesthetic)
  labelLg: {
    fontSize: 14,
    fontFamily: FontFamily.sansSemiBold,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  labelMd: {
    fontSize: 12,
    fontFamily: FontFamily.sansMedium,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSm: {
    fontSize: 10,
    fontFamily: FontFamily.sansMedium,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0.8,
  },
} as const;
