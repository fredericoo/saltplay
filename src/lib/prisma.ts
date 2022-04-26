import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hasKey, hasProp } from './types/utils';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;

const errorMessages: Record<string, string> = {
  P2002: 'another entry already exists with this {}',
};

const getErrorMessage = (errorCode: string, field?: string) => {
  const errorMessage = hasKey(errorMessages, errorCode) ? errorMessages[errorCode] : undefined;
  if (!errorMessage) return `Unknown error code: ${errorCode}`;
  return errorMessage.replace('{}', field || 'field');
};

export const getErrorStack = (error: PrismaClientKnownRequestError) => {
  const errorMeta = error.meta && hasProp(error.meta, 'target') ? error.meta.target : undefined;
  return Array.isArray(errorMeta)
    ? errorMeta.map(e => ({
        type: e.code,
        path: e,
        message: getErrorMessage(error.code, e),
      }))
    : typeof errorMeta === 'string'
    ? [
        {
          type: error.code,
          path: errorMeta,
          message: getErrorMessage(error.code, errorMeta),
        },
      ]
    : [
        {
          type: error.code,
          path: undefined,
          message: getErrorMessage(error.code),
        },
      ];
};
