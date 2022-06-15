import theme from '@/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorModeToggler from './ColorModeToggler';

describe('Color Mode Toggler component', () => {
  test('Renders with dark mode turned on as default', () => {
    render(
      <ChakraProvider theme={theme}>
        <ColorModeToggler />
      </ChakraProvider>
    );

    const switcher = screen.getByRole('switch');
    expect(switcher).toHaveAttribute('aria-label', 'Dark mode');
    expect(switcher).toBeChecked();
  });

  test('When clicked, toggles colour mode', async () => {
    render(
      <ChakraProvider theme={theme}>
        <ColorModeToggler />
      </ChakraProvider>
    );

    const switcher = screen.getByRole('switch');
    const isCheckedAtStart = switcher.getAttribute('aria-checked') === 'true';

    await userEvent.click(switcher);

    // eslint-disable-next-line jest-dom/prefer-checked
    expect(switcher).toHaveAttribute('aria-checked', isCheckedAtStart ? 'false' : 'true');
  });
});
