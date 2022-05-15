const revalidateStaticPages = async (paths: string[] = ['/']) => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const url = `${protocol}://${process.env.VERCEL_URL}/api/revalidate?secret=${process.env.REVALIDATE_TOKEN}&${paths
    .map(path => `path=${path}`)
    .join('&')}`;
  return await fetch(url);
};

export default revalidateStaticPages;
