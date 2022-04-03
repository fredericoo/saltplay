import Editable, { EditableInput } from '@/components/Editable';
import EditableSlider from '@/components/Editable/EditableSlider';
import Settings from '@/components/Settings';
import { EditableField } from '@/lib/admin';
import { APIResponse } from '@/lib/types/api';
import axios from 'axios';
import { useState } from 'react';

const SettingsGroup = <T extends Record<string, unknown>>({
  fields,
  saveEndpoint,
  data,
}: {
  fields: EditableField<T>[];
  saveEndpoint: string;
  data: T | null;
}) => {
  const [editingFieldKey, setEditingFieldKey] = useState<EditableField<T>['id'] | null>(null);
  const [response, setResponse] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveField = async ({ id, value }: { id: EditableField<T>['id']; value: string | number | boolean }) => {
    setIsLoading(true);
    try {
      const res = await axios.patch<APIResponse<{ data: T }>>(saveEndpoint, { [id]: value }).then(res => res.data);
      if (res.status === 'ok') {
        setEditingFieldKey(null);
        setResponse(res.data);
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <Settings.List>
      {fields.map(field => {
        const value = response?.[field.id] || data?.[field.id];
        return (
          <Settings.Item key={field.id.toString()} label={field.label} htmlFor={field.id.toString()}>
            <Editable
              id={field.id}
              value={`${value}`}
              isEditing={editingFieldKey === field.id}
              onEdit={() => setEditingFieldKey(field.id)}
              onCancel={() => setEditingFieldKey(null)}
              onSave={({ id, value }) => handleSaveField({ id, value })}
              isDisabled={editingFieldKey === field.id && isLoading}
              preText={field.preText}
              // error={'Name is too short.'}
            >
              {field.type === 'text' ? (
                <EditableInput
                  fontSize="sm"
                  type="text"
                  name={field.id.toString()}
                  defaultValue={`${value}`}
                  autoComplete="off"
                  format={field.format}
                  validate={field.validate}
                  autoFocus
                />
              ) : field.type === 'number' ? (
                <EditableSlider
                  name={field.id.toString()}
                  min={field.min}
                  max={field.max}
                  defaultValue={value ? +value : undefined}
                />
              ) : null}
            </Editable>
          </Settings.Item>
        );
      })}
    </Settings.List>
  );
};

export default SettingsGroup;
