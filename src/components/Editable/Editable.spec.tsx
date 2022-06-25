import { gen } from '@/lib/testUtils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Editable from './Editable';

describe('Editable component', () => {
  test('When not editing, renders edit button', () => {
    const id = gen.string();
    render(<Editable id={id} isEditing={false} />);

    const editButton = screen.getByLabelText(`Edit field "${id}"`);

    expect(editButton).toBeInTheDocument();
  });

  test('When not editing, renders value and preText', () => {
    const id = gen.string();
    const value = gen.string();
    const preText = gen.string();
    render(<Editable id={id} isEditing={false} value={value} preText={preText} />);

    const renderedValue = screen.getByText(value);
    const renderedPreText = screen.getByText(preText);

    expect(renderedValue).toBeInTheDocument();
    expect(renderedPreText).toBeInTheDocument();
  });

  test('When clicking on Edit button, calls onEdit', async () => {
    const id = gen.string();
    const onEdit = jest.fn();
    render(<Editable id={id} onEdit={onEdit} isEditing={false} />);

    const editButton = screen.getByLabelText(`Edit field "${id}"`);

    await userEvent.click(editButton);

    expect(onEdit).toHaveBeenCalled();
  });

  test('When clicking on the field value itself, calls onEdit', async () => {
    const id = gen.string();
    const onEdit = jest.fn();
    const value = gen.string();
    render(<Editable id={id} onEdit={onEdit} isEditing={false} value={value} />);

    const valueButton = screen.getByRole('button', { name: value });

    await userEvent.click(valueButton);

    expect(onEdit).toHaveBeenCalled();
  });

  test('When isDisabled, clicking on Edit button does not call onEdit', async () => {
    const id = gen.string();
    const onEdit = jest.fn();
    render(<Editable id={id} onEdit={onEdit} isEditing={false} isDisabled />);

    const editButton = screen.getByLabelText(`Edit field "${id}"`);

    await userEvent.click(editButton);

    expect(onEdit).not.toHaveBeenCalled();
  });

  test('When isDisabled, clicking on the field value itself does not call onEdit', async () => {
    const id = gen.string();
    const onEdit = jest.fn();
    const value = gen.string();
    render(<Editable id={id} onEdit={onEdit} isEditing={false} value={value} isDisabled />);

    const valueButton = screen.getByRole('button', { name: value });

    await userEvent.click(valueButton);

    expect(onEdit).not.toHaveBeenCalled();
  });

  test('When editing, renders Submit and Cancel buttons', () => {
    render(<Editable id={''} isEditing={true} />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeInTheDocument();
  });

  test('When a children element with name “id” exists, submitting calls onSubmit with form element’s name and value', async () => {
    const id = gen.string();
    const onSave = jest.fn();
    const value = gen.string();
    render(
      <Editable id={id} onSave={onSave} isEditing={true}>
        <input name={id} type="text" defaultValue={value} />
      </Editable>
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await userEvent.click(submitButton);

    expect(onSave).toHaveBeenCalledWith({ id, value });
  });

  test('On clicking Submit, if children with name “id” is not found, does not call onSave', async () => {
    const id = gen.string();
    const onSave = jest.fn();
    render(<Editable id={id} onSave={onSave} isEditing={true}></Editable>);

    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await userEvent.click(submitButton);

    expect(onSave).not.toHaveBeenCalled();
  });
});
