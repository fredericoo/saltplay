import { getPlayerMentionName } from './notifyMatch';
import prisma from '@/lib/prisma';

const defaultArgs = { id: 'userId', name: 'userName', email: 'email@domain.com' };

describe('Given a playerId, returns a slack mention if a connected slack account is found, or the user’s name otherwise', () => {
  test('when a player has an account with type ‘slack’ and providerAccountId, returns a slack mention format', async () => {
    const providerAccountId = 'U0T9Q9Q9Q';
    // @ts-ignore
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      ...defaultArgs,
      accounts: [{ provider: 'slack', providerAccountId }],
    });

    const mention = await getPlayerMentionName('test');
    expect(mention).toContain(`<@${providerAccountId}>`);
  });

  test('when a player has no account found, returns the user’s name', async () => {
    // @ts-ignore
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      ...defaultArgs,
      accounts: [],
    });

    const mention = await getPlayerMentionName('test');
    expect(mention).toBe('userName');
  });
});
