import type { EditableField } from '@/components/admin/Field/types';
import { formatDateTime } from '@/lib/utils';
import { Switch } from '@chakra-ui/react';

const getDisplayValue = ({
  value,
  ...field
}: { value: string | number | boolean | undefined | null | object } & EditableField<Record<PropertyKey, unknown>>) => {
  switch (field.type) {
    case 'select':
      const options = Array.isArray(field.options) ? field.options : Object.values(field.options).flat();
      return options.find(option => option.value == value)?.label;
    case 'datetime':
      if (typeof value === 'string' || typeof value === 'number') {
        return formatDateTime(new Date(value));
      }
      if (value instanceof Date) {
        return formatDateTime(value);
      }
      return null;
    case 'switch':
      const booleanValue = value === true || value === 'true';
      return <Switch isReadOnly isChecked={booleanValue} />;
    default:
      return value?.toString();
  }
};

export default getDisplayValue;
