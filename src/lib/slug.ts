import slugify from 'slugify';
import { string } from 'yup';

export const toSlug = (str: string): string => slugify(str || '', { lower: true, strict: true, trim: false });

export const validateSlug = (str?: string): boolean =>
  !!str && str === slugify(str, { lower: true, strict: true, trim: true });

export const slugSchema = string().test(
  'is-slug',
  d => `${d.value} does not match a slug format`,
  slug => typeof slug === 'undefined' || validateSlug(slug)
);
