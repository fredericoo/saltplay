import type { Season } from '@prisma/client';

export const WEBSITE_URL = 'https://saltplay.app';
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export const DASHBOARD_ROLES = [0];
export const GUEST_ROLE_ID = 2;
export const USER_ROLE_ID = 1;
export const BANNED_ROLE_ID = 3;

export const MATCH_DELETE_DAYS = 1;
export const PAGE_SIZE = 5;

// game constants
export const STARTING_POINTS = 100;
export const BASE_MATCH_POINTS = 10;
export const MIN_MATCH_POINTS = 1;
export const MAX_MATCH_POINTS = 100;
export const INITIAL_SEASON: Pick<Season, 'name' | 'slug'> = { name: 'Season 0', slug: 'season-0' };
export const DEFAULT_MEDAL_BG = 'f5f5f5';

export const PAGE_REVALIDATE_SECONDS = 60;

// game flags
export const GAME_FLAGS = { babyBottleIfHumiliated: 1 };
