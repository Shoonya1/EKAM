/// <reference types="expo-router/types" />

/**
 * EKAM — Global Type Declarations
 * Provides type safety for Expo Router routes
 */

// Ensure this file is treated as a module
export {};

declare global {
  namespace ExpoRouter {
    interface StaticRoutes {
      '/(tabs)/': undefined;
      '/(tabs)/index': undefined;
      '/(tabs)/peher': undefined;
      '/(tabs)/habits': undefined;
      '/(tabs)/wallet': undefined;
      '/(tabs)/profile': undefined;
      '/(tabs)/finance': undefined;
      '/(tabs)/wellness': undefined;
      '/(tabs)/journal': undefined;
      '/(tabs)/mentors': undefined;
      '/(tabs)/quest': undefined;
      '/(tabs)/settings': undefined;
      '/(auth)/welcome': undefined;
    }
  }
}
