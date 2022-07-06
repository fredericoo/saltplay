import { postOfficeSchema } from '@/lib/api/schemas';
import prisma, { getErrorStack } from '@/lib/prisma';
import revalidateStaticPages from '@/lib/revalidateStaticPages';
import { canViewDashboard } from '@/lib/roles';
import { APIResponse } from '@/lib/types/api';
import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { withSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { InferType, ValidationError } from 'yup';

type PostOfficeBody = InferType<typeof postOfficeSchema>;
export type ValidGamePostResponse = Awaited<ReturnType<typeof createOffice>>;
export type OfficePOSTAPIResponse = APIResponse<ValidGamePostResponse>;

const createOffice = (body: PostOfficeBody) =>
  prisma.office.create({
    data: body,
  });

const postOfficeHandler: NextApiHandler<OfficePOSTAPIResponse> = async (req, res) => {
  await postOfficeSchema
    .validate(req.body, { abortEarly: false, stripUnknown: true })
    .then(async body => {
      const session = await unstable_getServerSession(req, res, nextAuthOptions);
      const canEdit = canViewDashboard(session?.user.roleId);
      if (!session || !canEdit) return res.status(401).json({ status: 'error', message: 'Unauthorised' });

      return await createOffice(body)
        .then(async office => {
          await revalidateStaticPages(['/', `/${office.slug}`], res);
          res.status(200).json({ status: 'ok', data: office });
        })
        .catch((error: PrismaClientKnownRequestError) => {
          const stack = getErrorStack(error);
          return res.status(400).json({ status: 'error', stack });
        });
    })
    .catch((err: ValidationError) => {
      console.error(err);
      const stack = err.inner.map(err => ({
        type: err.type,
        path: err.path as keyof ValidGamePostResponse,
        message: err.errors.join('; '),
      }));
      return res.status(400).json({ status: 'error', stack });
    });
};

export default withSentry(postOfficeHandler);
