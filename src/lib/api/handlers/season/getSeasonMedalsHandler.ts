import { DEFAULT_MEDAL_BG } from '@/constants';
import medals from '@/lib/medals';
import prisma from '@/lib/prisma';
import { APIResponse } from '@/lib/types/api';
import { Medal } from '@prisma/client';
import { NextApiHandler } from 'next';

export type MedalURLs = Record<Medal['id'], { url: string; name: Medal['name']; isHolographic: boolean }>;
export type SeasonMedalsGETAPIResponse = APIResponse<MedalURLs>;

const getSeasonMedalsHandler: NextApiHandler<SeasonMedalsGETAPIResponse> = async (req, res) => {
  const seasonId = req.query.id;
  if (typeof seasonId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid season id' });

  const season = await prisma.season.findUnique({
    where: { id: seasonId },
    select: {
      colour: true,
      medals: {
        select: {
          id: true,
          name: true,
          image: true,
          season: { select: { name: true, game: { select: { icon: true } } } },
        },
      },
    },
  });

  if (!season) return res.status(404).json({ status: 'error', message: 'Season not found' });

  const medalUrls: MedalURLs = Object.fromEntries(
    season?.medals.map(medal => [
      medal.id,
      {
        url: `/api/medal/${medal.image}.svg?bg=${season.colour || DEFAULT_MEDAL_BG}&icon=${
          medal.season?.game.icon || '?'
        }`,
        isHolographic: !!medal.image && !!medals[medal.image].holo,
        name: medal.name,
      },
    ])
  );

  // cache for 1 hour
  process.env.NODE_ENV === 'production' && res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json({ status: 'ok', data: medalUrls });
};

export default getSeasonMedalsHandler;
