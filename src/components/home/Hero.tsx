import { getOffices } from '@/lib/home';
import { gradientProps } from '@/lib/styleUtils';
import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import List from '../List';

type HeroProps = {
  offices: Awaited<ReturnType<typeof getOffices>>;
};

const Hero: React.VFC<HeroProps> = ({ offices }) => {
  const officesWithGames = offices?.filter(office => office.games.length) || [];

  return (
    <Container maxW="container.xl" px={{ lg: 8 }} position={{ md: 'sticky' }} top="0" zIndex="0">
      <SimpleGrid mx="auto" columns={{ lg: 2 }} gap={8} alignItems="center" minH="90vh">
        <Box pt={32} pb={16} textAlign={{ base: 'center', lg: 'left' }}>
          <Heading
            as="h1"
            fontSize={{ base: '5rem', md: '6rem' }}
            lineHeight="1"
            letterSpacing="tighter"
            color="grey.11"
            mb={8}
          >
            work hard,
            <br />
            <Text as="span" bg={gradientProps} backgroundClip="text">
              play hard.
            </Text>
          </Heading>
          <Text color="grey.11" maxW="44ch" mb={4} mx={{ base: 'auto', lg: 0 }}>
            Get your personal OKRs ready: SaltPlay (pun very intended) enables you to brag over your office games
            performance. <br />A way more interesting way to{' '}
            <Text as="span" whiteSpace="nowrap">
              1-on-1
            </Text>
            .
          </Text>
        </Box>

        <Box py={8}>
          <Heading as="h2" mb={4} fontSize="md" color="grey.10" pl={14}>
            Explore games in
          </Heading>
          <List columns={officesWithGames.length > 4 ? 2 : 1}>
            {officesWithGames.map(office => (
              <List.Item
                key={office.slug}
                href={`/${office.slug}`}
                icon={office.icon ?? undefined}
                badge={`${office.games.length} game${office.games.length !== 1 ? 's' : ''}`}
              >
                {office.name}
              </List.Item>
            ))}
          </List>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Hero;
