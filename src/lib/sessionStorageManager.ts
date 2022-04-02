import { ColorMode } from '@chakra-ui/react';

const hasSupport = () => typeof window.sessionStorage !== 'undefined';
export const storageKey = 'chakra-ui-color-mode';

type MaybeColorMode = ColorMode | undefined;

export interface StorageManager {
  get(init?: ColorMode): MaybeColorMode;
  set(value: ColorMode): void;
  type: 'cookie' | 'localStorage';
}

export const localStorageManager: StorageManager = {
  get(init?) {
    if (!hasSupport()) return init;
    try {
      const value = localStorage.getItem(storageKey) as MaybeColorMode;
      return value ?? init;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }
      return init;
    }
  },
  set(value) {
    if (!hasSupport()) return;
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }
    }
  },
  type: 'localStorage',
};
