/**
 * Formats dates in a human readable format.
 * @param date Date to be formatted
 * @param options Int.DateTimeFormatOptions
 */

export const formatDateTime = (
  date: Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' }
) => new Intl.DateTimeFormat('en-GB', options).format(date);
