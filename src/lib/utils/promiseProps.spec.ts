import { promiseProps } from './promiseProps';

describe('given an object with promises as values', () => {
  test('returns an object with responses for each promise', async () => {
    const input = {
      a: Promise.resolve(1),
      b: Promise.resolve(2),
      c: Promise.resolve(3),
    };
    const output = await promiseProps(input);
    expect(output).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});
