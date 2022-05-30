import { NextApiResponse } from 'next';

const revalidateStaticPages = async (paths: string[] = ['/'], res: NextApiResponse) => {
  await Promise.all(
    paths.map(async path => {
      await res.unstable_revalidate(path);
    })
  );
};

export default revalidateStaticPages;
