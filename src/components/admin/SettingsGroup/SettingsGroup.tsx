import Editable from '@/components/admin/Editable';
import Field from '@/components/admin/Field';
import type { EditableField, FieldData } from '@/components/admin/Field/types';
import Settings from '@/components/shared/Settings';
import type { APIError, APIResponse, APISuccess } from '@/lib/types/api';
import { hasKey } from '@/lib/types/utils';
import type { AxiosError } from 'axios';
import axios from 'axios';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { ValidationError } from 'yup';
import type { SchemaLike } from 'yup/lib/types';
import getDisplayValue from './getDisplayValue';

const SettingsGroup = ({
  fields,
  saveEndpoint,
  fieldSchema,
  data,
  children,
}: {
  fields: EditableField<FieldData>[];
  data?: Partial<FieldData> | null;
  fieldSchema: SchemaLike;
  saveEndpoint: string;
  children?: ReactNode;
}) => {
  const [editingFieldKey, setEditingFieldKey] = useState<typeof fields[number]['id'] | null>(null);
  const [response, setResponse] = useState<APISuccess<FieldData>>();
  const [error, setError] = useState<APIError<FieldData>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveField = async ({
    id,
    value,
  }: {
    id: EditableField<FieldData>['id'];
    value: string | number | boolean;
  }) => {
    setIsLoading(true);
    const body = { [id]: value };
    await fieldSchema
      .validate(body, { abortEarly: false, stripUnknown: true })
      .then(async (body: FieldData) => {
        await axios
          .patch<APIResponse<FieldData>>(saveEndpoint, body)
          .then(res => {
            if (res.data.status !== 'ok') throw new Error('Unexpected response');
            setResponse(res.data);
            setEditingFieldKey(null);
            setError(undefined);
          })
          .catch((e: AxiosError) => {
            const response: APIError<FieldData> = e.response?.data;
            setError(response);
          });
      })
      .catch((err: ValidationError) => {
        const stack = err.inner.map(err => ({ type: err.type, path: err.path, message: err.errors.join('; ') }));
        const response: APIError<FieldData> = { status: 'error', stack };
        setError(response);
      });

    setIsLoading(false);
  };
  const res = response?.data;

  return (
    <Settings.List>
      {fields.map(field => {
        const resValue = res && hasKey(res, field.id) ? res?.[field.id] : undefined;
        const value = res && typeof resValue !== 'object' ? resValue : data?.[field.id];
        const displayValue = getDisplayValue({ value, ...field });
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
              preText={field.prefix}
              error={errorMessage}
            >
              <Field field={field} align="right" prefix={field.prefix} value={value} autoFocus />
            </Editable>
          </Settings.Item>
        );
      })}
      {children}
    </Settings.List>
  );
};

export default SettingsGroup;
