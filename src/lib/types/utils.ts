export type ArrayElement<ArrayType extends unknown[] | undefined> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
