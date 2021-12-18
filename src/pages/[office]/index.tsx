import { Box, Container, Heading, Link, Text } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import { createApi } from 'unsplash-js';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import getBlurHashDataUrl from '@/lib/getBlurHashDataUrl';
import OfficeHeader from '@/components/OfficeHeader';

type OfficePageProps = {
  office?: Office;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return (
    <>
      <OfficeHeader title={office.name} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const offices = await prisma.office.findMany({
    select: { slug: true },
  });
  return {
    paths: offices.map(office => ({ params: { office: office.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (typeof params?.office === 'string') {
    const slug = params?.office;
    const office = await prisma.office.findUnique({ where: { slug } });

    return {
      props: {
        office,
      },
      revalidate: 60 * 60 * 24,
    };
  }

  return {
    props: { office: undefined },
  };
};

export default OfficePage;
