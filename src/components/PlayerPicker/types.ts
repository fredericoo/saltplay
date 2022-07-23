import type { PartialBy } from '@/lib/types/utils';
import type { Opponents } from '@/pages/api/games/[id]/opponents';

export type Player = PartialBy<Opponents[number], 'scores'> & { source?: string };
