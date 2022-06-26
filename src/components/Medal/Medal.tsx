/* eslint-disable @next/next/no-img-element */
import { Box, styled, Tooltip } from '@chakra-ui/react';
import type { Medal as DBMedal } from '@prisma/client';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { MotionBox } from '../Motion';
import { getRelativeCoordinates } from './utils';

type MedalProps = Pick<DBMedal, 'id'> & { name: string; image: string; isHolographic?: boolean };

const MedalWrapper = motion(
  styled(Box, {
    baseStyle: {
      w: '2em',
      h: '2em',
      display: 'inline-block',
      position: 'relative',
    },
  })
);

const Medal: React.VFC<MedalProps> = ({ name, image, isHolographic }) => {
  const [mousePosition, setMousePosition] = useState<ReturnType<typeof getRelativeCoordinates>>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition(getRelativeCoordinates(e, boxRef.current));
  };

  return (
    <Tooltip label={name} placement="top" offset={[0, 32]} variant="medal">
      <Box zIndex={1} _hover={{ zIndex: 2 }}>
        <MedalWrapper
          ref={boxRef}
          onMouseMove={(e: MouseEvent) => handleMouseMove(e)}
          whileHover={
            mousePosition
              ? {
                  scale: 3,
                  rotateY: mousePosition.centerX * -20,
                  rotateX: mousePosition.centerY * 20,
                  filter: `brightness(${
                    1 +
                    ((-mousePosition.centerX - mousePosition.centerY) / (mousePosition.height + mousePosition.width)) *
                      3
                  })`,
                }
              : {}
          }
        >
          <Box as="img" position="absolute" inset="0" src={image || '/medals/default.svg'} alt={name} />
          {isHolographic && image && (
            <MotionBox
              role="presentation"
              position="absolute"
              inset="0"
              mixBlendMode="hard-light"
              css={{
                maskImage: `url(/medals/${image}_holo.png)`,
                maskSize: 'contain',
              }}
              background={`linear-gradient(var(--gradient-direction),
              rgba(255, 0, 0, 1) 0%,
              rgba(255, 154, 0, 1) 10%,
              rgba(208, 222, 33, 1) 20%,
              rgba(79, 220, 74, 1) 30%,
              rgba(63, 218, 216, 1) 40%,
              rgba(47, 201, 226, 1) 50%,
              rgba(28, 127, 238, 1) 60%,
              rgba(95, 21, 242, 1) 70%,
              rgba(186, 12, 248, 1) 80%,
              rgba(251, 7, 217, 1) 90%,
              rgba(255, 0, 0, 1) 100%
          )`}
              alt=""
              aria-hidden
              initial={{ opacity: 0 }}
              whileHover={
                mousePosition
                  ? {
                      '--gradient-direction': `${
                        mousePosition
                          ? -(mousePosition.centerX / mousePosition.width) * 360 -
                            (mousePosition.centerY / mousePosition.height) * 360
                          : 135
                      }deg`,
                      opacity:
                        0.25 +
                        ((-mousePosition.centerX - mousePosition.centerY) /
                          (mousePosition.height + mousePosition.width)) *
                          10,
                      transition: {
                        duration: 0.1,
                      },
                    }
                  : {}
              }
            />
          )}
        </MedalWrapper>
      </Box>
    </Tooltip>
  );
};

export default Medal;
