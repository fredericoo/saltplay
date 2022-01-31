import { ArrayElement, PartialBy } from '@/lib/types/utils';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';

export type Player = PartialBy<ArrayElement<OpponentsAPIResponse['opponents']>, 'scores'> & { source?: string };
