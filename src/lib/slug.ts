import slugify from 'slugify';

export const toSlug = (str: string): string => slugify(str || '', { lower: true, strict: true, trim: false });

export const validateSlug = (str?: string): boolean =>
  !!str && str === slugify(str, { lower: true, strict: true, trim: true });
