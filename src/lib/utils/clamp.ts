export const clamp = (num: number, min = -9999999, max = 9999999) => {
  return Math.min(Math.max(num, min), max);
};
