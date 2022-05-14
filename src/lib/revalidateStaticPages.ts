const revalidateStaticPages = async (paths: string[] = ['/']) => {
  return await fetch(
    `${process.env.VERCEL_URL}/api/revalidate?secret=${process.env.REVALIDATE_TOKEN}&${paths
      .map(path => `path=${path}`)
      .join('&')}`
  );
};

export default revalidateStaticPages;
