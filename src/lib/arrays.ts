export const sortAlphabetically = <T>(array: T[], valueFn: (item: T) => string) =>
  array.sort((a, b) => valueFn(a).localeCompare(valueFn(b)));
