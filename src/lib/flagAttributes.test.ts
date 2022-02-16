import { getFlagNumberFromToggles, getFlagTogglesFromNumber } from './flagAttributes';

describe('Given a Record of flag labels and numbers and a flagAttributes number, returns an object with the keys and values as a boolean', () => {
  test('when provided with an empty object, then returns an empty object', () => {
    const result = getFlagTogglesFromNumber({}, 4);
    expect(result).toEqual({});
  });

  test('when provided 1, returns the first key as true', () => {
    const result = getFlagTogglesFromNumber({ foo: 1, bar: 2 }, 1);
    expect(result.foo).toEqual(true);
  });

  test('when provided with a number that does not match any keys, returns all the values as false', () => {
    const result = getFlagTogglesFromNumber({ foo: 1, bar: 2 }, 4);
    expect(result.foo).toEqual(false);
    expect(result.bar).toEqual(false);
  });

  test('when provided with a number that matches multiple keys, returns the keys as true', () => {
    const result = getFlagTogglesFromNumber({ foo: 1, bar: 2 }, 3);
    expect(result.foo).toEqual(true);
    expect(result.bar).toEqual(true);
  });

  test('when provided with a negative number, returns all keys as false', () => {
    const result = getFlagTogglesFromNumber({ foo: 1, bar: 2 }, -1);
    expect(result.foo).toEqual(false);
    expect(result.bar).toEqual(false);
  });

  test('when provided with 12 keys and a number that matches the last 3, returns the last 3 as true', () => {
    const result = getFlagTogglesFromNumber(
      {
        foo: 1,
        bar: 2,
        baz: 4,
        qux: 8,
        quux: 16,
        corge: 32,
        grault: 64,
        garply: 128,
        waldo: 256,
        fred: 512,
        plugh: 1024,
        xyzzy: 2048,
      },
      3584
    );
    expect(result.fred).toEqual(true);
    expect(result.plugh).toEqual(true);
    expect(result.xyzzy).toEqual(true);
  });

  test('when provided with an array of keys and the flag being 0, returns all values as false', () => {
    const result = getFlagTogglesFromNumber({ foo: 1, bar: 2 }, 0);
    expect(result.foo).toEqual(false);
    expect(result.bar).toEqual(false);
  });
});

describe('Given an object with keys and booleans as values, returns a number that represents which toggles are on or off', () => {
  test('when provided with an empty object, returns 0', () => {
    const result = getFlagNumberFromToggles({});
    expect(result).toEqual(0);
  });
  test('when provided with an object with 2 keys and both values as true, returns 3', () => {
    const result = getFlagNumberFromToggles({ foo: true, bar: true });
    expect(result).toEqual(3);
  });
  test('when provided with 5 elements where only the first and last are equal to true, returns 17', () => {
    const result = getFlagNumberFromToggles({ foo: true, bar: false, baz: false, qux: false, quux: true });
    expect(result).toEqual(17);
  });
});
