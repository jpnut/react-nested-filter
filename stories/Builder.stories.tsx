import React from 'react';
import { action } from '@storybook/addon-actions';
import { Builder, Props, isNil } from '../src';
import { Operators, DefaultFieldDefinitions } from '../src/types';
import '../src/styles.scss';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (
  props?: Partial<Props<'product' | 'tax', DefaultFieldDefinitions>>
) => (
  <Builder
    onFilter={action('filter')}
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
);

type CustomTypes = {
  range: {
    step?: number;
  };
};

type CustomFieldDefinitions = DefaultFieldDefinitions & CustomTypes;

export const CustomField = (
  props?: Partial<Props<'product', CustomFieldDefinitions>>
) => (
  <Builder
    onFilter={action('filter')}
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
            type: 'range',
            fieldProps: {
              step: 1,
            },
          },
          amount2: {
            type: 'number',
            fieldProps: {
              step: 2,
            },
          },
          available: {
            type: 'boolean',
          },
          created_at: {
            type: 'date',
          },
        },
      },
    }}
    fieldSchema={defaultFieldSchema => ({
      ...defaultFieldSchema,
      range: {
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
        render: ({ value, setValue }) => {
          const toNumber = (value: any) =>
            typeof value === 'number' ? value : Number(value);
          const handleChange = ({
            target: { value: newValue },
          }: React.ChangeEvent<HTMLInputElement>) => {
            if (isNil(newValue) || newValue === '') {
              return setValue(undefined);
            }
            setValue(toNumber(newValue));
          };
          return (
            <div className="rnf-builder__rule-input-wrapper">
              <input
                className="rnf-builder__rule-input rnf-builder__input"
                type="range"
                value={isNil(value) ? '' : value}
                onChange={handleChange}
              />
            </div>
          );
        },
      },
    })}
    {...props}
  />
);
