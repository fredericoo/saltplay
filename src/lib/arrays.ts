export const sortAlphabetically = <T>(array: T[], valueFn: (item: T) => string | undefined) =>
  array.sort((a, b) => ((valueFn(a)?.[0] || 'z') > (valueFn(b)?.[0] || 'z') ? 1 : -1));
