import { PartialBy } from '@/lib/types/utils';
import { Opponents } from '@/pages/api/games/[id]/opponents';

export type Player = PartialBy<Opponents[number], 'scores'> & { source?: string };
