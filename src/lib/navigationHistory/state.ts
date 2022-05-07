import { atom } from 'jotai';

export type HistoryState = {
  title?: string;
  href?: string;
};

const pastHistoryAtom = atom<HistoryState[]>([]);

export const currentHistoryStateAtom = atom(get => {
  const history = get(pastHistoryAtom);
  return history[history.length - 1];
});

export const lastHistoryStateAtom = atom(get => {
  const history = get(pastHistoryAtom);
  return history[history.length - 2];
});

export const writeHistoryStateAtom = atom<null, HistoryState | undefined>(null, (get, set, newHistoryState) => {
  if (!newHistoryState) return;

  const history = get(pastHistoryAtom);

  const lastHistoryState = history[history.length - 1];
  const secondLastHistoryState = history[history.length - 2];

  if (lastHistoryState?.href === newHistoryState?.href) return;

  if (secondLastHistoryState?.href === newHistoryState?.href) {
    const lastHistory = history.slice(0, history.length - 1);
    set(pastHistoryAtom, lastHistory);
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
    set(pastHistoryAtom, [...lastHistory, newHistoryState]);
    return;
  }

  set(pastHistoryAtom, [...history, newHistoryState]);
});
