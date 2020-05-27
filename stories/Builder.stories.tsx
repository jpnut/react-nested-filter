import React from 'react';
import { Builder, Props } from '../src';
import { Schema, FieldTypes, FieldSchema, Operators } from '../src/types';
import {
  IDField,
  StringField,
  NumberField,
  DateField,
  BooleanField,
} from '../src/fields';
import '../src/styles.scss';

export default {
  title: 'Welcome',
};

type Resources = 'product' | 'tax';

const schema: Schema<Resources> = {
  product: {
    fields: {
      id: {
        name: 'ID',
        type: FieldTypes.ID,
      },
      name: {
        type: FieldTypes.STRING,
      },
      amount: {
        type: FieldTypes.NUMBER,
      },
      available: {
        type: FieldTypes.BOOLEAN,
      },
      created_at: {
        type: FieldTypes.DATE,
      },
    },
    relations: {
      tax: 'tax',
    },
  },
  tax: {
    fields: {
      id: {
        type: FieldTypes.ID,
      },
      name: {
        type: FieldTypes.STRING,
      },
      rate: {
        type: FieldTypes.NUMBER,
      },
    },
  },
};

const fieldSchema: FieldSchema = {
  [FieldTypes.ID]: {
    operators: [Operators.IS, Operators.IS_NOT],
    render: IDField,
  },
  [FieldTypes.STRING]: {
    operators: [
      Operators.CONTAINS,
      Operators.DOES_NOT_CONTAIN,
      Operators.BEGINS,
      Operators.DOES_NOT_BEGIN,
      Operators.ENDS,
      Operators.DOES_NOT_END,
      Operators.LIKE,
      Operators.NOT_LIKE,
      Operators.IS,
      Operators.IS_NOT,
      Operators.NULL,
      Operators.NOT_NULL,
    ],
    render: StringField,
  },
  [FieldTypes.NUMBER]: {
    operators: [
      Operators.IS,
      Operators.IS_NOT,
      Operators.LESS_THAN,
      Operators.LESS_THAN_OR_EQUAL_TO,
      Operators.GREATER_THAN,
      Operators.GREATER_THAN_OR_EQUAL_TO,
      Operators.NULL,
      Operators.NOT_NULL,
    ],
    render: NumberField,
  },
  [FieldTypes.DATE]: {
    operators: [
      Operators.IS,
      Operators.IS_NOT,
      Operators.LESS_THAN,
      Operators.LESS_THAN_OR_EQUAL_TO,
      Operators.GREATER_THAN,
      Operators.GREATER_THAN_OR_EQUAL_TO,
      Operators.NULL,
      Operators.NOT_NULL,
    ],
    render: DateField,
  },
  [FieldTypes.BOOLEAN]: {
    operators: [
      Operators.IS,
      Operators.IS_NOT,
      Operators.NULL,
      Operators.NOT_NULL,
    ],
    render: BooleanField,
    defaultValue: () => false,
  },
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const NestedFilter = (props?: Partial<Props<Resources>>) => (
  <Builder
    onFilter={() => undefined}
    resource="product"
    schema={schema}
    fieldSchema={fieldSchema}
    {...props}
  />
);
