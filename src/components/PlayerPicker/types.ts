import { ArrayElement } from '@/lib/types/utils';
import { OpponentsAPIResponse } from '@/pages/api/games/[id]/opponents';
import { InvitePlayersAPIResponse } from '@/pages/api/players/invite';

export type Player = ArrayElement<OpponentsAPIResponse['opponents']> | ArrayElement<InvitePlayersAPIResponse['users']>;
