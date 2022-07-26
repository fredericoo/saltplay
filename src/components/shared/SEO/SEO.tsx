import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  desc?: string;
  type?: string;
  imageUrl?: string;
}

const TERMS = {
  title: 'SaltPlay',
  baseURL: process.env.VERCEL_URL,
};

const SEO: React.FC<SEOProps> = ({ title, desc, type, imageUrl }) => {
  const { asPath } = useRouter();
  const tabInfo = {
    title: title ? `${TERMS.title} ⁄ ${title}` : TERMS.title,
    desc: desc ? desc : TERMS.title,
  };

  const seoImage = imageUrl || '';

  return (
    <Head>
      <title>{tabInfo.title}</title>
      <meta property="og:title" content={tabInfo.title} />

      <meta property="og:description" content={tabInfo.desc} />
      <meta name="description" content={tabInfo.desc} />

      <link rel="canonical" href={`${TERMS.baseURL}${asPath}`} />
      <meta property="og:url" content={`${TERMS.baseURL}${asPath}`} />

      <meta property="og:image" content={seoImage} />

      <meta property="og:type" content={type || 'website'} />
    </Head>
  );
};

export default SEO;
