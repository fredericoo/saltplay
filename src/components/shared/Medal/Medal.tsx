/* eslint-disable @next/next/no-img-element */
import useSeasonMedals from '@/lib/useSeasonMedals';
import type { CSSObject } from '@chakra-ui/react';
import { Box, keyframes, styled, Text, Tooltip } from '@chakra-ui/react';
import type { Medal as DBMedal, Season } from '@prisma/client';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { getRelativeCoordinates } from './utils';

type MedalProps = { id: DBMedal['id']; seasonId: Season['id'] };

const shimmer = keyframes`
	0% {
		background-position: 0% 0%;
    opacity: 0
	}
	50% {
    background-position: 50% 50%;
    opacity: .9
  }
	100% {
    background-position: 86% 86%;
    opacity: 0
	}`;

const wrapperStyle: CSSObject = {
  w: '2em',
  h: '2em',
  display: 'inline-block',
  position: 'relative',
};

const MedalWrapper = motion(
  styled(Box, {
    baseStyle: wrapperStyle,
  })
);

const Medal: React.VFC<MedalProps> = ({ id, seasonId }) => {
  const { data: res, error } = useSeasonMedals(seasonId);
  const [mousePosition, setMousePosition] = useState<ReturnType<typeof getRelativeCoordinates>>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  if (error || res?.status !== 'ok')
    return (
      <span tabIndex={0}>
        <Box sx={wrapperStyle} color="grey.6">
          <svg viewBox="0 0 308 308" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M140 8.0829C148.663 3.08118 159.337 3.08119 168 8.0829L273.368 68.9171C282.031 73.9188 287.368 83.1624 287.368 93.1658V214.834C287.368 224.838 282.031 234.081 273.368 239.083L168 299.917C159.337 304.919 148.663 304.919 140 299.917L34.6321 239.083C25.9688 234.081 20.6321 224.838 20.6321 214.834V93.1658C20.6321 83.1624 25.9689 73.9188 34.6321 68.9171L140 8.0829Z"
              fill="currentColor"
            />
          </svg>
        </Box>
      </span>
    );

  const medal = res.data?.[id];

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition(getRelativeCoordinates(e, boxRef.current));
  };

  return (
    <Tooltip
      label={
        <Box textAlign="center">
          <Text>{medal?.description}</Text>
          <Text fontWeight="bold">{medal?.name}</Text>
        </Box>
      }
      placement="top"
      shouldWrapChildren
      offset={[0, 32]}
      variant="medal"
      closeOnClick={false}
    >
      <MedalWrapper
        css={{ transformStyle: 'preserve-3d' }}
        ref={boxRef}
        onMouseMove={handleMouseMove}
        initial={{ scale: 1 }}
        whileHover={
          mousePosition
            ? {
                transition: { scale: { delay: 0.25 }, default: { delay: 0 } },

                zIndex: 2,
                scale: 2,
                rotateY: mousePosition.centerX * -20,
                rotateX: mousePosition.centerY * 20,
                filter: `brightness(${
                  1 +
                  ((-mousePosition.centerX - mousePosition.centerY) / (mousePosition.height + mousePosition.width)) * 10
                })`,
              }
            : {}
        }
      >
        <Box
          as="img"
          position="absolute"
          inset="0"
          src={medal?.url || '/medals/default.svg'}
          alt={medal?.name || 'Badge'}
        />
        {medal?.isHolographic && medal.url && (
          <Box
            role="presentation"
            position="absolute"
            inset="0"
            mixBlendMode="hard-light"
            css={{
              maskImage: `url(${medal.url.replace('.svg', '_holo.svg')})`,
              maskSize: 'contain',
            }}
            background={`linear-gradient(-30deg,
              rgba(255, 0, 0, 1),
              rgba(255, 154, 0, 1),
              rgba(208, 222, 33, 1),
              rgba(79, 220, 74, 1),
              rgba(63, 218, 216, 1),
              rgba(47, 201, 226, 1),
              rgba(28, 127, 238, 1),
              rgba(95, 21, 242, 1),
              rgba(186, 12, 248, 1),
              rgba(251, 7, 217, 1),
              rgba(255, 0, 0, 1)
          )`}
            backgroundSize="200% 200%"
            aria-hidden
            animation={`${shimmer} 2s linear infinite`}
          />
        )}
      </MedalWrapper>
    </Tooltip>
  );
};

export default Medal;
