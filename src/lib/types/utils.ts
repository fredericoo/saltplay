export type ArrayElement<ArrayType extends unknown[] | undefined> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function hasProp<K extends PropertyKey>(data: object, prop: K): data is Record<K, unknown> {
  return prop in data;
}

export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
  return key in obj;
}
