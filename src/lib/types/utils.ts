export type PromiseElement<P> = P extends Promise<infer U> ? U : P;

export type ArrayElement<ArrayType extends unknown[] | undefined> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;
