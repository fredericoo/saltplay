import fetcher from '@/lib/fetcher';
import getBlurHashDataUrl from '@/lib/getBlurHashDataUrl';
import { RandomPhotoApiResponse } from '@/pages/api/photo/random';
import { Box, Container, Heading, Text, Link, Skeleton } from '@chakra-ui/react';
import Image from 'next/image';
import useSWR from 'swr';

type OfficeHeaderProps = {
  title: string;
};

const OfficeHeader: React.VFC<OfficeHeaderProps> = ({ title }) => {
  const { data } = useSWR<RandomPhotoApiResponse>(`/api/photo/random?q=${title}&perPage=10`, fetcher, {
    revalidateOnFocus: false,
  });
  const { photo } = data || {};

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
          <Heading size="3xl">{title}</Heading>
          <Text fontSize="sm" textAlign="right" opacity=".7">
            Photo by{' '}
            <Skeleton display="inline" isLoaded={!!photo?.user}>
              {photo?.user ? (
                <Link
                  href={`https://unsplash.com/${photo.user.username}?utm_source=saltplay&utm_medium=referral`}
                  target="_blank"
                  rel="no-referrer noreferrer"
                >
                  {photo?.user.name}
                </Link>
              ) : (
                'Loading…'
              )}
            </Skeleton>{' '}
            on{' '}
            <Link href="https://unsplash.com" target="_blank" rel="no-referrer noreferrer">
              Unsplash
            </Link>
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default OfficeHeader;
