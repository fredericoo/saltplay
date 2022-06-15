import { gen } from '@/lib/testUtils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmButton, { ConfirmButtonProps, DEFAULT_KEYWORD } from './ConfirmButton';

const renderAndClickModal = async (props?: Partial<ConfirmButtonProps>) => {
  const label = gen.string();
  render(<ConfirmButton {...{ ...props, onConfirm: props?.onConfirm || jest.fn() }}>{label}</ConfirmButton>);

  const button = screen.getByText(label);

  await userEvent.click(button);
};

describe('Confirm Button', () => {
  test('When clicked, opens modal', async () => {
    await renderAndClickModal();

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  test('Submit button starts out disabled', async () => {
    await renderAndClickModal();

    const submitButton = screen.getByRole('button', { name: 'Confirm' });
    expect(submitButton).toBeDisabled();
  });

  test('Submit button becomes enabled when input is filled with keyword', async () => {
    const keyword = gen.string();
    await renderAndClickModal({ keyword });

    const submitButton = screen.getByRole('button', { name: 'Confirm' });
    const input = screen.getByRole('textbox');

    await userEvent.type(input, keyword);

    expect(submitButton).toBeEnabled();
  });

  test('Submit button becomes disabled when input does not match keyword', async () => {
    const keyword = gen.string();
    await renderAndClickModal({ keyword });

    const submitButton = screen.getByRole('button', { name: 'Confirm' });
    const input = screen.getByRole('textbox');

    await userEvent.type(input, keyword.slice(0, -1));

    expect(submitButton).toBeDisabled();
  });

  test('Input will match regardless of capitalisation', async () => {
    const keyword = gen.string().toUpperCase();
    await renderAndClickModal({ keyword });

    const submitButton = screen.getByRole('button', { name: 'Confirm' });
    const input = screen.getByRole('textbox');

    await userEvent.type(input, keyword.toLowerCase());
    expect(submitButton).toBeEnabled();
  });

  test('When not provided with keyword, it defaults to DEFAULT_KEYWORD global', async () => {
    await renderAndClickModal();

    const submitButton = screen.getByRole('button', { name: 'Confirm' });
    const input = screen.getByRole('textbox');

    await userEvent.type(input, DEFAULT_KEYWORD);
    expect(submitButton).toBeEnabled();
  });

  test('When submit button is clicked, onConfirm is called', async () => {
    const onConfirm = jest.fn();
    await renderAndClickModal({ onConfirm });

    const submitButton = screen.getByRole('button', { name: 'Confirm' });
    const input = screen.getByRole('textbox');

    await userEvent.type(input, DEFAULT_KEYWORD);
    await userEvent.click(submitButton);

    expect(onConfirm).toHaveBeenCalled();
  });

  test('On clicking Cancel, closes modal', async () => {
    await renderAndClickModal();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await userEvent.click(cancelButton);

    const modal = screen.getByRole('dialog');
    await waitFor(() => {
      expect(modal).not.toBeInTheDocument();
    });
  });
});
