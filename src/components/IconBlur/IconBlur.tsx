import { Box, ChakraProps } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

type IconBlurProps = {
  icon?: string | null;
  blurAmount?: number;
};

const drawBlur = (canvas: HTMLCanvasElement, icon: IconBlurProps['icon'], blurAmount: IconBlurProps['blurAmount']) => {
  const context = canvas.getContext('2d');
  if (!context || !icon) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = `${Math.min(canvas.width, canvas.height) / 2}px serif`;
  context.textBaseline = 'middle';
  const { width } = context.measureText(icon);
  context.fillText(icon, (canvas.width - width) / 2, canvas.height / 2);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0, n = imageData.data.length; i < n; i += 4) {
    imageData.data[i + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
};

const IconBlur: React.VFC<IconBlurProps & Omit<ChakraProps, keyof IconBlurProps>> = ({
  icon,
  blurAmount = 32,
  ...boxProps
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    canvasRef.current && drawBlur(canvasRef.current, icon || '', blurAmount);
  }, [blurAmount, icon]);
  if (!icon) return null;

  return (
    <Box
      overflow="hidden"
      sx={{ maskImage: 'radial-gradient(closest-side, rgba(0,0,0,1), rgba(0,0,0,0))' }}
      left="0"
      top="0"
      position="absolute"
      w="100%"
      h="100%"
      {...boxProps}
    >
      <canvas ref={canvasRef} style={{ height: '100%', top: 0, left: 0, width: '100%' }} height="1" width="1" />
    </Box>
  );
};
export default IconBlur;
