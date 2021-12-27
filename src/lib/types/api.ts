type APIError<T extends Record<string | number, unknown>> = {
  status: 'error';
  message: string;
} & Partial<Record<keyof T, never>>;

type APISuccess<T extends Record<string | number, unknown>> = {
  status: 'ok';
  message?: never;
} & T;

export type APIResponse<T extends Record<string | number, unknown> = {}> = APIError<T> | APISuccess<T>;
