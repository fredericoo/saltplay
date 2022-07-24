/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import { render } from '@testing-library/react';
import Field from './Field';
import type { FieldTypeSpecific } from './types';

type FieldType = FieldTypeSpecific['type'];
type FieldTypes = {
  [K in FieldType]: FieldTypeSpecific & { type: K };
};
const fieldTypeProps: FieldTypes = {
  datetime: { type: 'datetime' },
  emoji: { type: 'emoji' },
  number: { type: 'number' },
  select: { type: 'select', options: [] },
  switch: { type: 'switch' },
  text: { type: 'text' },
};

describe('Field', () => {
  test.each(Object.entries(fieldTypeProps))(
    'when rendering field of type %s renders an element with the name property',
    (_, props) => {
      const name = 'nameToTest';

      const { container } = render(<Field align="left" field={{ id: name, label: '', ...props }} />);

      const element = container.querySelector(`[name="${name}"]`);

      expect(element).not.toBeNull();
    }
  );
});
