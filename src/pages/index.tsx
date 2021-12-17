import { Office } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import prisma from '../lib/prisma';

type HomeProps = {
  offices: Office[];
};

const Home: NextPage<HomeProps> = ({ offices }) => {
  return (
    <div>
      <h1>List of offices:</h1>
      <ul>
        {offices.map(office => (
          <li key={office.id}>
            <a href={`/users/${office.id}`}>{office.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const offices = await prisma.office.findMany();
  return {
    props: { offices: offices },
  };
};

export default Home;
