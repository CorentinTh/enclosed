import { describe, expect, test, vi, beforeEach } from 'vitest';
import { AES_256_GCM, CHACHA20_POLY1305, getConfig } from './config.provider';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();

// Mock the window.localStorage
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Config Provider', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });
  
  test('getConfig returns default encryption algorithm when none is set', () => {
    const config = getConfig();
    expect(config.preferredEncryptionAlgorithm).toBe(AES_256_GCM);
  });
  
  test('getConfig returns ChaCha20-Poly1305 when set in localStorage', () => {
    localStorageMock.setItem('enclosed_encryption_algorithm', CHACHA20_POLY1305);
    const config = getConfig();
    expect(config.preferredEncryptionAlgorithm).toBe(CHACHA20_POLY1305);
  });
  
  test('getConfig ignores invalid encryption algorithm in localStorage', () => {
    localStorageMock.setItem('enclosed_encryption_algorithm', 'invalid-algorithm');
    const config = getConfig();
    expect(config.preferredEncryptionAlgorithm).toBe(AES_256_GCM);
  });
});