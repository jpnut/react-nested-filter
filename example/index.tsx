import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Builder, Schema, FieldTypes } from '../';

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
const App = () => {
  return (
    <div>
      <Builder onFilter={() => undefined} resource="product" schema={schema} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
