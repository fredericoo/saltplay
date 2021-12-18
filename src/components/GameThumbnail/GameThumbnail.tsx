import { Box } from '@chakra-ui/react';
import { Game } from '@prisma/client';
import Link from 'next/link';

type GameThumbnailProps = {
  game: Pick<Game, 'name'>;
  href: string;
};

const GameThumbnail: React.VFC<GameThumbnailProps> = ({ game, href }) => {
  return (
    <Link href={href} passHref>
      <Box as="a" bg="gray.100" p={8} borderRadius="lg">
        {game.name}
      </Box>
    </Link>
  );
};

export default GameThumbnail;
