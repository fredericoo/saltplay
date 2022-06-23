import { EditableField } from '@/lib/admin';
import { Select, Switch } from '@chakra-ui/react';
import DateTimeField from './DateTimeField';
import EmojiField from './EmojiField';
import InputField from './InputField';
import NumberField from './NumberField';

type FieldProps<TData> = {
  field: EditableField<TData>;
  placeholder?: string;
  autoFocus?: boolean;
  isInvalid?: boolean;
  prefix?: string;
  suffix?: string;
  align: 'left' | 'right';
  value?: string | number | boolean | TData[keyof TData];
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
        <InputField
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
    case 'switch':
      return (
        <Switch
          name={field.id.toString()}
          defaultChecked={typeof value === 'string' ? value === 'true' : typeof value === 'boolean' ? value : false}
        />
      );
    case 'number':
      return (
        <NumberField
          name={field.id.toString()}
          min={field.min}
          max={field.max}
          defaultValue={typeof value === 'string' ? +value : typeof value === 'number' ? value : undefined}
        />
      );
    case 'emoji':
      return (
        <EmojiField
          name={field.id.toString()}
          align={align}
          autoFocus={autoFocus}
          label={placeholder}
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
          {Array.isArray(field.options)
            ? field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : Object.entries(field.options).map(([group, options]) => (
                <optgroup key={group} label={group}>
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
        </Select>
      );
    case 'datetime':
      return (
        <DateTimeField
          name={field.id.toString()}
          align={align}
          autoFocus={autoFocus}
          label={placeholder}
          defaultValue={typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : ''}
        />
      );
    default:
      return null;
  }
};

export default Field;
