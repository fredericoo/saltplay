import { Box } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import { NextPage, GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';

type OfficePageProps = {
  office: Office;
};

const OfficePage: NextPage<OfficePageProps> = ({ office }) => {
  if (!office) return <Box>404</Box>;

  return (
    <Box>
      <h1>{office.name}</h1>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.office === 'string') {
    const slug = params?.office;
    const office = await prisma.office.findUnique({ where: { slug } });

    return {
      props: {
        office,
      },
    };
  }

  return {
    props: { office: undefined },
  };
};

export default OfficePage;
