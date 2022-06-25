import { format } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';

/**
 * Formats dates in a human readable format.
 * @param date Date to be formatted
 * @param pattern pattern according to https://date-fns.org/v2.28.0/docs/format.
 */
export const formatDateTime = (date: Date, pattern: string) => format(date, pattern, { locale: enGB });
