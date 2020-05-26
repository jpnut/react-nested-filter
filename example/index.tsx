import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Builder,
  Schema,
  FieldTypes,
  FieldSchema,
  Operators,
  IDField,
  StringField,
  NumberField,
  DateField,
  BooleanField,
} from '../';

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

const App = () => {
  return (
    <div>
      <Builder
        onFilter={() => undefined}
        resource="product"
        schema={schema}
        fieldSchema={fieldSchema}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
