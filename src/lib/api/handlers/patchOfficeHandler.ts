import prisma from '@/lib/prisma';
import { canViewDashboard } from '@/lib/roles';
import { slugSchema } from '@/lib/slug';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { Office } from '@prisma/client';
import { NextApiHandler } from 'next';
import { getServerSession } from 'next-auth';
import { object, string } from 'yup';

export type OfficePATCHAPIResponse = APIResponse<{ data: Office }>;

const editableFieldsSchema = object().shape({
  name: string(),
  icon: string(),
  slug: slugSchema,
});

const patchOfficeHandler: NextApiHandler<OfficePATCHAPIResponse> = async (req, res) => {
  await editableFieldsSchema
    .validate(req.body, { abortEarly: false })
    .then(async body => {
      const session = await getServerSession({ req, res }, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      const officeId = req.query.id;

      if (typeof officeId !== 'string') return res.status(400).json({ status: 'error', message: 'Invalid office id' });
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      try {
        const office = await prisma.office.update({
          where: { id: officeId },
          data: body,
        });
        res.status(200).json({ status: 'ok', data: office });
      } catch {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ status: 'error', message: err.errors[0].message });
    });
};

export default patchOfficeHandler;
