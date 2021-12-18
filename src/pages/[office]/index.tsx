import { Box, Container, Heading, Link, Text } from '@chakra-ui/react';
import { Office } from '@prisma/client';
import { createApi } from 'unsplash-js';
import { NextPage, GetServerSideProps } from 'next';
import prisma from '@/lib/prisma';
import { Basic as UnsplashPhoto } from 'unsplash-js/dist/methods/photos/types';
import Image from 'next/image';
import getBlurHashDataUrl from '@/lib/getBlurHashDataUrl';

type OfficePageProps = {
  office?: Office;
  photo?: UnsplashPhoto;
};

const OfficePage: NextPage<OfficePageProps> = ({ office, photo }) => {
  if (!office) return <Box>404</Box>;

  return (
    <Box height="60vh" position="relative" display="flex" alignItems="flex-end" bg="gray.800">
      {photo && (
        <Image
          src={photo.urls.full}
          alt={photo.alt_description || ''}
          unoptimized
          objectFit="cover"
          layout="fill"
          placeholder="blur"
          blurDataURL={getBlurHashDataUrl(photo.blur_hash || '', 200, 200, 0)}
        />
      )}
      <Box w="100%" bg="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.5))" position="relative">
        <Container py={4} maxW="container.lg" color="white">
          <Heading size="3xl">{office.name}</Heading>
          {photo?.user && (
            <Text fontSize="sm" textAlign="right" opacity=".7">
              Photo by{' '}
              <Link
                href={`https://unsplash.com/${photo.user.username}?utm_source=saltplay&utm_medium=referral`}
                target="_blank"
                rel="no-referrer noreferrer"
              >
                {photo?.user.name}
              </Link>{' '}
              on{' '}
              <Link href="https://unsplash.com" target="_blank" rel="no-referrer noreferrer">
                Unsplash
              </Link>
            </Text>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (typeof params?.office === 'string') {
    const slug = params?.office;
    const office = await prisma.office.findUnique({ where: { slug } });

    const accessKey = process.env.UNSPLASH_API_KEY;
    const unsplash = accessKey
      ? createApi({
          accessKey,
        })
      : undefined;

    const photo = office?.name
      ? (await unsplash?.search.getPhotos({ query: office.name, perPage: 5 }))?.response?.results?.[
          Math.floor(Math.random() * 5)
        ]
      : null;

    return {
      props: {
        office,
        photo,
      },
    };
  }

  return {
    props: { office: undefined },
  };
};

export default OfficePage;
