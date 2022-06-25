import { clamp } from './clamp';

describe('clamps a number between a min and max', () => {
  test('given a number higher than max returns max', () => {
    expect(clamp(10, 0, 5)).toBe(5);
  });

  test('given a number lower than min returns min', () => {
    expect(clamp(-10, 0, 5)).toBe(0);
  });

  test('given a number between min and max returns the number', () => {
    expect(clamp(2, 0, 5)).toBe(2);
  });
});
