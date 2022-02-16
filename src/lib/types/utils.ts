export type PromiseElement<P> = P extends Promise<infer U> ? U : P;

export type ArrayElement<ArrayType extends unknown[] | undefined> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
