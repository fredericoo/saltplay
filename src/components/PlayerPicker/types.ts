import { ArrayElement } from '@/lib/types/utils';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';

export type Player = ArrayElement<OpponentsAPIResponse['opponents']>;
