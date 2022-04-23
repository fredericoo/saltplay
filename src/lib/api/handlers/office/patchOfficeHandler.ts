import prisma, { getErrorStack } from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Office } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { patchOfficeSchema } from '../../schemas';

export type OfficePATCHAPIResponse = APIResponse<Office>;

const patchOfficeHandler: NextApiHandler<OfficePATCHAPIResponse> = async (req, res) => {
  await patchOfficeSchema
    .validate(req.body, { abortEarly: false })
    .then(async body => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const officeId = req.query.id;

      if (typeof officeId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid office id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      return await prisma.office
        .update({
          where: { id: officeId },
          data: body,
        })
        .then(office => res.status(200).json({ status: 'ok', data: office }))
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
