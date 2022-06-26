import { Medal, Season } from '@prisma/client';

export type ArrayElement<ArrayType extends unknown[] | undefined> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function hasProp<K extends PropertyKey>(data: object, prop: K): data is Record<K, unknown> {
  return prop in data;
}

export function hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}

export type UserMedals = {
  medals?: (Pick<Medal, 'image' | 'name' | 'holographic'> & { season: Pick<Season, 'icon'> | null })[] | null;
};
export type WithDatesAsStrings<T extends object> = { [K in keyof T]: T[K] extends Date ? string : K };
