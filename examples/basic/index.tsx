import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Builder, DefaultFieldDefinitions, Props } from '../../';
import '../../styles.css';

const App = (
  props?: Partial<Props<'product' | 'tax', DefaultFieldDefinitions>>
) => {
  return (
    <div>
      <Builder
        onFilter={() => undefined}
        resource="product"
        schema={{
          product: {
            fields: {
              id: {
                name: 'ID',
                type: 'id',
              },
              name: {
                type: 'string',
              },
              amount: {
                type: 'number',
                fieldProps: {
                  step: 1,
                },
              },
              available: {
                type: 'boolean',
              },
              created_at: {
                type: 'date',
              },
            },
            relations: {
              tax: 'tax',
            },
          },
          tax: {
            fields: {
              id: {
                type: 'id',
              },
              name: {
                type: 'string',
              },
              rate: {
                type: 'number',
                fieldProps: {
                  step: 1,
                },
              },
            },
          },
        }}
        {...props}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
