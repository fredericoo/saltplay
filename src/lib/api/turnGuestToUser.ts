import { USER_ROLE_ID } from '@/constants';
import prisma from '@/lib/prisma';
import { Account, User } from 'next-auth/core/types';
import notifyNewcomer from '../slackbot/notifyNewcomer';

const turnGuestToUser = async (user: User, account: Account) => {
  const provider_providerAccountId = { provider: account.provider, providerAccountId: account.providerAccountId };
  const { type, token_type, id_token, access_token, state } = account;
  try {
    await prisma.account.update({
      where: { provider_providerAccountId: provider_providerAccountId },
      data: { type, token_type, id_token, access_token, session_state: state as string },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { roleId: USER_ROLE_ID },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
  notifyNewcomer({ providerAccountId: account.providerAccountId, name: user.name, image: user.image });
};

export default turnGuestToUser;
