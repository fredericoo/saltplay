const revalidateStaticPages = async () => {
  return await fetch(`${process.env.VERCEL_URL}/api/revalidate?secret=${process.env.REVALIDATE_TOKEN}`);
};

export default revalidateStaticPages;
