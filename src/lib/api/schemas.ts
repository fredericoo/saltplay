import { GAME_FLAGS } from '@/constants';
import { number, object, string } from 'yup';
import { validateSlug } from '../slug';

export const slugSchema = string().test(
  'is-slug',
  ({ value }) => `${value} does not match a slug format`,
  slug => typeof slug === 'undefined' || slug === '' || validateSlug(slug)
);

const emojiRegex = new RegExp(
  '[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]',
  'u'
);
const validateEmoji = (emoji?: string) => emoji?.match(emojiRegex);

const iconSchema = string().test(
  'is-emoji',
  ({ value }) => `${value} is not an emoji`,
  icon => typeof icon === 'undefined' || icon === '' || !!validateEmoji(icon)
);

export const gameFlagsSchema = number()
  .min(0)
  .max(Object.values(GAME_FLAGS).reduce((acc, cur) => acc + cur));

export const postOfficeSchema = object().shape({
  name: string().required().max(32).min(2),
  icon: iconSchema,
  slug: slugSchema.required(),
});

export const patchOfficeSchema = object().shape({
  name: string(),
  icon: iconSchema,
  slug: slugSchema,
});

export const postGameSchema = object({
  name: string().required().min(2).trim(),
  icon: iconSchema,
  slug: slugSchema.required(),
  flags: gameFlagsSchema.default(0),
  maxPlayersPerTeam: number().max(11).default(1),
  officeid: string().required(),
});

export const patchGameSchema = object({
  name: string().min(2),
  icon: iconSchema,
  slug: slugSchema,
  flags: gameFlagsSchema,
  maxPlayersPerTeam: number().max(10),
  officeid: string(),
});

export const postSeasonSchema = object({
  name: string().min(2).required(),
  slug: slugSchema.required(),
  startDate: string().required(),
  endDate: string(),
  gameid: string().required(),
});

export const patchSeasonSchema = object({
  name: string().min(2),
  slug: slugSchema,
  startDate: string(),
  endDate: string(),
  gameid: string(),
});

export const updateUserAccountSchema = object({
  id: string().required(),
});

export const patchUserSchema = object({
  name: string(),
  roleId: number(),
});

export const patchPlayerScoreSchema = object().shape({
  id: string(),
  points: number(),
  gameId: string(),
});

export const deletePlayerScoreSchema = object().shape({
  id: string(),
});
