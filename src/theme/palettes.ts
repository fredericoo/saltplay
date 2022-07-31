import type { User } from '@prisma/client';

const colourPalettes = [
  ['#9682D9', '#CA8CEA', '#AFADF8'],
  ['#FDD6AD', '#B3F3D9', '#F7EFBD'],
  ['#F5887E', '#FE8EB4', '#FEC1AF'],
  ['#C79EFC', '#BBC8FF', '#FDBEF2'],
  ['#60D3CD', '#7FDDEF', '#9AF2C8'],
];

const getGradientFromId = (userId?: User['id']) => {
  if (!userId) return '#f0f0f0';
  const uniqueKey = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameColour = colourPalettes[uniqueKey % colourPalettes.length];
  return `linear-gradient(135deg, ${nameColour.join(',')})`;
};

export default getGradientFromId;
