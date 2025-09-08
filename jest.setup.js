// Correct import for jest-expo setup
import 'jest-expo/jest-setup';

// Mock native modules that might not be available in Jest environment
jest.mock('expo-navigation-bar', () => ({
  setBackgroundColorAsync: jest.fn(),
  setButtonStyleAsync: jest.fn(),
  setVisibilityAsync: jest.fn(),
  setPositionAsync: jest.fn(),
  setBehaviorAsync: jest.fn(),
  getBackgroundColorAsync: jest.fn(),
  getButtonStyleAsync: jest.fn(),
  getVisibilityAsync: jest.fn(),
  getPositionAsync: jest.fn(),
  getBehaviorAsync: jest.fn(),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  removeListeners: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null), // Mock StatusBar component
}));

// Mock for Dimensions needed by Digit.js and Result.js
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 667, scale: 2, fontScale: 1 })), // Provide mock dimensions
  set: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock for Vibration
jest.mock('react-native/Libraries/Vibration/Vibration', () => ({
  vibrate: jest.fn(),
  cancel: jest.fn(),
}));

console.log('Jest setup file executed with jest-expo/jest-setup.');
