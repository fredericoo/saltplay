import type { Player } from '@/components/shared/NewMatchButton/PlayerPicker/types';
import type { User } from '@prisma/client';
import { assign, createMachine } from 'xstate';

type Context = {
  players: User[];
  iteration: number;
  selectedSide: 'left' | 'right' | undefined;
  teams: { left: Player[]; right: Player[] };
  scores: { left: number; right: number };
  teamLength: number;
};

const matchBlockMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QFsCGAXAxgCwEIBsB7TAawDpYx8xN0BLAOygAJY6IwBiRUAB0Lb1CDHiAAeiAIwAOAMwAmMgHYArCvkBOACxaADNLWyVAGhABPRJo1kNkyVoBsDySrkrZHgL6fTaLHiJSMlQICEYWXnxUMzAAJ1hOMVh0DDBggDN0OIAKZLBeAEpOPxwCYnIQsKZmSOi4+CQQfkE6YVEJBBldBzJpLSVJJX6VXS0PDVMLBABaeVkyeQctSVlnFQ11SVtvXwxSwPIAd1Q6emr0wljmakzWTEuuJJSsjKzY3KzC4r2A8rJj07hZgXK43dB3B6iZqAtqNDqLaRkLR9IwaWRaDQbTEOSZSdYLTHyVxaFRKByaMY7EAlX5BAFnFgg5ixOhQbDg2D3WKPZKpV45PJfGllOknBnAy7M1nsiHcqECGEiOGIBxKRQjFaSImSJxokzmPHWKxEvqk8naWRU4UHf5ioFMmnMuAAV3w6ASTz5qEyAs+RWtf3p9slju5sFd7vlLVhoA6kl0GzIpK0i1kCcG0lxnSUiKUtjGankKYc2itPxF5Fg2EIhyBYYjHt5L29bw++X95ZtVZrdZdboafAVQiVsaky0RskxBkGyw2qyzLiNhOJZop3h8IAYhA4A+pnb+lGotCBbA4UcV7SkS3mDncSnRKh10jRsgXauU0lU5Pc3VGKjL-gVsEoRArUMTxOew6Xgg8j6NYGjSDI0hWFs7gLq4BKyFsGhFroWHyPI0gAfsgZ2uckpgrKYCQa0I7iIgKZvooOaqMaDhGGMREbgGoqAuRVwsmyHJctRjTQlByoIGMPRjEY6x9C4eYTAa2bMZ+7gaEouhkhSlrcfuvHig6PxOuG-Y0TG9EIH0uhIiMj5pvoWHokxH6qJOWk6RaxG0pW1a1tU9bmWJQ60dBWpzAsuEYt+czzipgxqe5mnaealL6YBBwWXRcaZip0waD0RIjPIinONIBhcd4QA */
  createMachine(
    {
      context: {
        players: [],
        iteration: 0,
        selectedSide: undefined,
        teams: { left: [], right: [] },
        scores: { left: 0, right: 0 },
        teamLength: 2,
      },
      tsTypes: {} as import('./matchBlockMachine.typegen').Typegen0,
      schema: {} as {
        context: Context;
      },
      id: 'matchBlock',
      initial: 'selecting side',
      states: {
        'selecting side': {
          always: [
            {
              actions: 'selectFirstEmptySide',
              cond: 'hasEmptySide',
              target: 'adding players',
            },
            {
              actions: 'clearSelectedSide',
              target: 'waiting for left score',
            },
          ],
        },
        'adding players': {
          entry: 'addPlayerToSide',
          after: {
            step: [
              {
                cond: 'reachedMaxPlayers',
                target: 'selecting side',
              },
              {
                target: 'adding players',
                internal: false,
              },
            ],
          },
        },
        'waiting for left score': {
          meta: 'left',
          after: {
            step: {
              actions: 'randomiseScore',
              target: 'waiting for right score',
            },
          },
        },
        'waiting for right score': {
          meta: 'right',
          after: {
            step: {
              actions: 'randomiseScore',
              target: 'waiting for match results',
            },
          },
        },
        'waiting for match results': {
          after: {
            step: {
              target: 'showing results',
            },
          },
        },
        'showing results': {
          after: {
            step: {
              actions: 'resetAndIncreaseIteration',
              target: 'selecting side',
            },
          },
        },
      },
    },
    {
      actions: {
        clearSelectedSide: assign({
          selectedSide: _ => undefined,
        }),
        selectFirstEmptySide: assign({
          selectedSide: context => (['left', 'right'] as const).find(side => !context.teams[side].length),
        }),
        addPlayerToSide: assign({
          teams: context => {
            if (!context.selectedSide) return context.teams;
            return {
              ...context.teams,
              [context.selectedSide]: [...context.teams[context.selectedSide], context.players.at(-1)],
            };
          },
          players: context => context.players.slice(0, -1),
        }),
        randomiseScore: assign({
          scores: (context, _, meta) => {
            const side = Object.values(meta.state?.meta)[0] as 'left' | 'right';
            return {
              ...context.scores,
              [side]: Math.floor(Math.random() * 10),
            };
          },
        }),
        resetAndIncreaseIteration: assign({
          iteration: context => context.iteration + 1,
          teams: _ => ({
            left: [],
            right: [],
          }),
          scores: _ => ({
            left: 0,
            right: 0,
          }),
          selectedSide: _ => undefined,
        }),
      },
      guards: {
        hasEmptySide: context => {
          return (['left', 'right'] as const).some(side => !context.teams[side].length);
        },
        reachedMaxPlayers: context => {
          if (!context.selectedSide) return false;
          return context.teams[context.selectedSide].length >= context.teamLength;
        },
      },
      delays: {
        step: 500,
      },
    }
  );

export default matchBlockMachine;
