import { GAME_FLAGS } from '@/constants';
import { number, object, string } from 'yup';
import { validateSlug } from '../slug';

export const slugSchema = string().test(
  'is-slug',
  d => `${d.value} does not match a slug format`,
  slug => typeof slug === 'undefined' || validateSlug(slug)
);

export const gameFlagsSchema = number()
  .min(0)
  .max(Object.values(GAME_FLAGS).reduce((acc, cur) => acc + cur));

export const patchOfficeSchema = object().shape({
  name: string(),
  icon: string(),
  slug: slugSchema,
});

export const patchGameSchema = object({
  name: string().min(2),
  icon: string().max(3),
  slug: slugSchema,
  flags: gameFlagsSchema,
  maxPlayersPerTeam: number().max(10),
});

export const patchUserSchema = object({
  name: string(),
  roleId: number(),
});

export const patchPlayerScoreSchema = object().shape({
  id: string(),
  points: number().required(),
});

export const deletePlayerScoreSchema = object().shape({
  id: string(),
});
