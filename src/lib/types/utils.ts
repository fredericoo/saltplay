export type PromiseElement<P> = P extends Promise<infer U> ? U : P;
