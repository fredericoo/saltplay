import medals from '@/lib/medals';
import { GetServerSideProps } from 'next';

const Dummy: React.FC = () => null;
export default Dummy;

export const getServerSideProps: GetServerSideProps = async ({ params, query, res }) => {
  if (typeof params?.src !== 'string' || typeof query?.season !== 'string') {
    return { notFound: true };
  }
  if (!params.src.endsWith('.svg')) {
    return { notFound: true };
  }

  const src = params.src.replace(/\.svg$/, '');

  if (!(src in medals)) {
    return { notFound: true };
  }
  const medalSvg = medals[src](query?.season);

  res.setHeader('content-type', 'image/svg');
  res.write(medalSvg);
  res.end();

  return { props: {} };
};
