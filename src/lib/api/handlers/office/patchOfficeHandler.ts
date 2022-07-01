import prisma, { getErrorStack } from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Office } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { patchOfficeSchema } from '../../schemas';

export type OfficePATCHAPIResponse = APIResponse<Office>;

const patchOfficeHandler: NextApiHandler<OfficePATCHAPIResponse> = async (req, res) => {
  await patchOfficeSchema
    .validate(req.body, { abortEarly: false, stripUnknown: true })
    .then(async body => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const officeId = req.query.id;

      if (typeof officeId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid office id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      return await prisma.office
        .update({
          where: { id: officeId },
          data: body,
          include: { games: { select: { slug: true } } },
        })
        .then(async office => {
          await revalidateStaticPages(
            ['/', `/${office.slug}`, ...office.games.map(game => `/${office.slug}/${game.slug}`)],
            res
          );
          res.status(200).json({ status: 'ok', data: office });
        })
        .catch((error: PrismaClientKnownRequestError) => {
          const stack = getErrorStack(error);
          return res.status(400).json({ status: 'error', stack });
        });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default patchOfficeHandler;
