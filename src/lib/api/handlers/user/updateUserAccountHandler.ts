import { updateUserAccountSchema } from '@/lib/api/schemas';
import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import slack from '@/lib/slack/client';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';

export type UserAccountPATCHAPIResponse = APIResponse;

const updateUserAccountHandler: NextApiHandler<UserAccountPATCHAPIResponse> = async (req, res) => {
  await updateUserAccountSchema
    .validate(req.query, { abortEarly: false, stripUnknown: true })
    .then(async body => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      const accounts = await prisma.user.findUnique({ where: { id: body.id } }).accounts();

      const response = await Promise.all(
        accounts.map(async account => {
          if (account?.provider === 'slack') {
            const userInfo = await slack.users
              .info({
                user: account.providerAccountId,
              })
              .catch(error => {
                console.error(error.data);
                return null;
              });

            if (!userInfo?.user?.profile) return false;

            await prisma.user.update({
              where: { id: body.id },
              data: { name: userInfo.user.profile.display_name, image: userInfo.user.profile.image_512 },
            });
          }
          return true;
        })
      );

      if (response.some(r => r === false))
        return res.status(500).json({ status: 'error', message: 'Failed to update information' });

      res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
      return res.status(200).json({ status: 'ok' });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default updateUserAccountHandler;
