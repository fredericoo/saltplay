// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    selectFirstEmptySide: '';
    clearSelectedSide: '';
    randomiseScore:
      | 'xstate.after(step)#matchBlock.waiting for left score'
      | 'xstate.after(step)#matchBlock.waiting for right score';
    resetAndIncreaseIteration: 'xstate.after(step)#matchBlock.showing results';
    addPlayerToSide: '' | 'xstate.after(step)#matchBlock.adding players';
  };
  internalEvents: {
    '': { type: '' };
    'xstate.after(step)#matchBlock.waiting for left score': {
      type: 'xstate.after(step)#matchBlock.waiting for left score';
    };
    'xstate.after(step)#matchBlock.waiting for right score': {
      type: 'xstate.after(step)#matchBlock.waiting for right score';
    };
    'xstate.after(step)#matchBlock.showing results': { type: 'xstate.after(step)#matchBlock.showing results' };
    'xstate.after(step)#matchBlock.adding players': { type: 'xstate.after(step)#matchBlock.adding players' };
    'xstate.after(step)#matchBlock.waiting for match results': {
      type: 'xstate.after(step)#matchBlock.waiting for match results';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    hasEmptySide: '';
    reachedMaxPlayers: 'xstate.after(step)#matchBlock.adding players';
  };
  eventsCausingDelays: {
    step: 'xstate.init';
  };
  matchesStates:
    | 'selecting side'
    | 'adding players'
    | 'waiting for left score'
    | 'waiting for right score'
    | 'waiting for match results'
    | 'showing results';
  tags: never;
}
