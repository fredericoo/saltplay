export const getFlagTogglesFromNumber = (flagKeys: string[], flagValue: number): Record<string, boolean> => {
  if (flagKeys.length === 0) return {};
  const bitWise = flagKeys.reduce((acc, cur, index) => ({ ...acc, [cur]: 2 ** index }), {} as Record<string, number>);
  return Object.keys(bitWise).reduce(
    (acc, cur) => ({ ...acc, [cur]: flagValue > 0 && (flagValue & bitWise[cur]) !== 0 }),
    {}
  );
};

export const getFlagNumberFromToggles = (flagToggles: Record<string, boolean>): number => {
  if (Object.keys(flagToggles).length === 0) return 0;
  return Object.values(flagToggles).reduce((acc, cur, index) => (cur ? acc + 2 ** index : acc), 0);
};
