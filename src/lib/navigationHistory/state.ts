import { atom, DefaultValue, selector } from 'recoil';

export type HistoryState = {
  title?: string;
  href?: string;
};

const pastHistory = atom<HistoryState[]>({
  key: 'pastHistory',
  default: [],
});

export const currentHistoryState = selector<HistoryState | undefined>({
  key: 'currentHistoryState',
  get: ({ get }) => {
    const history = get(pastHistory);
    return history[history.length - 1];
  },
});

export const lastHistoryState = selector<HistoryState | undefined>({
  key: 'lastHistoryState',
  get: ({ get }) => {
    const history = get(pastHistory);
    return history[history.length - 2];
  },
  set: ({ set, get }, newHistoryState) => {
    if (newHistoryState instanceof DefaultValue || typeof newHistoryState === 'undefined') return;
    const history = get(pastHistory);
    const lastHistoryState = history[history.length - 1];
    const secondLastHistoryState = history[history.length - 2];

    if (lastHistoryState?.href === newHistoryState?.href) return;
    if (secondLastHistoryState?.href === newHistoryState?.href) {
      const lastHistory = history.slice(0, history.length - 1);
      set(pastHistory, lastHistory);
      return;
    }

    if (
      lastHistoryState?.href &&
      secondLastHistoryState?.href &&
      secondLastHistoryState.href.length > 1 &&
      lastHistoryState.href.includes(secondLastHistoryState.href) &&
      newHistoryState.href?.includes(secondLastHistoryState.href)
    ) {
      const lastHistory = history.slice(0, history.length - 1);
      set(pastHistory, [...lastHistory, newHistoryState]);
      return;
    }

    set(pastHistory, [...history, newHistoryState]);
  },
});
