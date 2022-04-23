import { EditableField } from '@/lib/admin';
import { Select } from '@chakra-ui/react';
import { EditableInput } from '../Editable';
import EditableEmoji from '../Editable/EditableEmoji';
import EditableSlider from '../Editable/EditableSlider';

type FieldProps<TData> = {
  field: EditableField<TData>;
  placeholder?: string;
  autoFocus?: boolean;
  isInvalid?: boolean;
  prefix?: string;
  suffix?: string;
  align: 'left' | 'right';
  value?: string | number | TData[keyof TData];
};
const Field = <TData extends object>({
  field,
  autoFocus,
  placeholder,
  align,
  value,
  prefix,
  suffix,
  isInvalid,
}: FieldProps<TData>) => {
  switch (field.type) {
    case 'text':
      return (
        <EditableInput
          fontSize="sm"
          type="text"
          name={field.id.toString()}
          defaultValue={typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : ''}
          autoComplete="off"
          format={field.format}
          autoFocus={autoFocus}
          placeholder={placeholder}
          textAlign={align}
          isInvalid={isInvalid}
          prefix={prefix}
          suffix={suffix}
        />
      );
    case 'number':
      if (field.max && field.min)
        return (
          <EditableSlider
            name={field.id.toString()}
            min={field.min}
            max={field.max}
            defaultValue={typeof value === 'string' ? +value : typeof value === 'number' ? value : undefined}
          />
        );
      return (
        <EditableInput
          fontSize="sm"
          type="number"
          name={field.id.toString()}
          defaultValue={typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : ''}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={placeholder}
          textAlign={align}
          isInvalid={isInvalid}
          prefix={prefix}
          suffix={suffix}
        />
      );
    case 'emoji':
      return (
        <EditableEmoji
          name={field.id.toString()}
          align={align}
          autoFocus={autoFocus}
          defaultValue={typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : ''}
        />
      );
    case 'select':
      return (
        <Select
          name={field.id.toString()}
          defaultValue={`${value}`}
          autoFocus={autoFocus}
          textAlign={align}
          isInvalid={isInvalid}
          border="none"
          variant="transparent"
          fontSize="sm"
        >
          {(field.allowEmpty || placeholder) && <option value="">Select {placeholder}</option>}
          {field.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    default:
      return null;
  }
};

export default Field;
