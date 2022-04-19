import Editable, { EditableInput } from '@/components/Editable';
import EditableEmoji from '@/components/Editable/EditableEmoji';
import EditableSlider from '@/components/Editable/EditableSlider';
import Settings from '@/components/Settings';
import { EditableField } from '@/lib/admin';
import { APIError, APIResponse, APISuccess } from '@/lib/types/api';
import { hasProp } from '@/lib/types/utils';
import { Select } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { ReactNode, useState } from 'react';
import { ValidationError } from 'yup';
import { SchemaLike } from 'yup/lib/types';

const SettingsGroup = <TData extends Record<PropertyKey, string | number | boolean | undefined | null | object>>({
  fields,
  saveEndpoint,
  fieldSchema,
  data,
  children,
}: {
  fields: EditableField<TData>[];
  data?: Partial<TData> | null;
  fieldSchema: SchemaLike;
  saveEndpoint: string;
  children?: ReactNode;
}) => {
  const [editingFieldKey, setEditingFieldKey] = useState<typeof fields[number]['id'] | null>(null);
  const [response, setResponse] = useState<APISuccess<TData>>();
  const [error, setError] = useState<APIError<TData>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveField = async ({
    id,
    value,
  }: {
    id: EditableField<TData>['id'];
    value: string | number | boolean;
  }) => {
    setIsLoading(true);
    const body = { [id]: value };
    await fieldSchema
      .validate(body, { abortEarly: false })
      .then(async () => {
        await axios
          .patch<APIResponse<TData>>(saveEndpoint, body)
          .then(res => {
            if (res.data.status !== 'ok') throw new Error('Unexpected response');
            setResponse(res.data);
            setEditingFieldKey(null);
            setError(undefined);
          })
          .catch((e: AxiosError) => {
            const response: APIError<TData> = e.response?.data;
            setError(response);
          });
      })
      .catch((err: ValidationError) => {
        const stack = err.inner.map(err => ({ type: err.type, path: err.path, message: err.errors.join('; ') }));
        const response: APIError<TData> = { status: 'error', stack };
        setError(response);
      });

    setIsLoading(false);
  };

  return (
    <Settings.List>
      {fields.map(field => {
        const res = response?.data || {};
        const resValue = hasProp(res, field.id) ? res[field.id] : undefined;
        const value = typeof resValue === 'string' || typeof resValue === 'number' ? resValue : data?.[field.id];
        const displayValue = (() => {
          switch (field.type) {
            case 'select':
              return field.options.find(option => option.value == value)?.label;
            default:
              return `${value}`;
          }
        })();
        const errorMessage = error?.stack?.find(error => error.path === field.id)?.message;
        const isDisabled = (editingFieldKey === field.id && isLoading) || field.readOnly;
        return (
          <Settings.Item key={field.id.toString()} label={field.label} htmlFor={field.id.toString()}>
            <Editable
              id={field.id}
              value={displayValue}
              isEditing={editingFieldKey === field.id}
              onEdit={() => setEditingFieldKey(field.id)}
              onCancel={() => {
                setEditingFieldKey(null);
                setError(undefined);
              }}
              onSave={({ id, value }) => handleSaveField({ id, value })}
              isDisabled={isDisabled}
              preText={field.preText}
              error={errorMessage}
            >
              {field.type === 'text' ? (
                <EditableInput
                  fontSize="sm"
                  type="text"
                  name={field.id.toString()}
                  defaultValue={typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : ''}
                  autoComplete="off"
                  format={field.format}
                  validate={field.validate}
                  autoFocus
                />
              ) : field.type === 'number' ? (
                field.max && field.min ? (
                  <EditableSlider
                    name={field.id.toString()}
                    min={field.min}
                    max={field.max}
                    defaultValue={typeof value === 'string' ? +value : typeof value === 'number' ? value : undefined}
                  />
                ) : (
                  <EditableInput
                    fontSize="sm"
                    type="number"
                    name={field.id.toString()}
                    defaultValue={typeof value === 'string' ? value : typeof value === 'number' ? value.toString() : ''}
                    autoComplete="off"
                    autoFocus
                  />
                )
              ) : field.type === 'emoji' ? (
                <EditableEmoji name={field.id.toString()} defaultValue={`${value}`} />
              ) : field.type === 'select' ? (
                <Select name={field.id.toString()} defaultValue={`${value}`}>
                  {field.allowEmpty && <option value="">Select</option>}
                  {field.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : null}
            </Editable>
          </Settings.Item>
        );
      })}
      {children}
    </Settings.List>
  );
};

export default SettingsGroup;
