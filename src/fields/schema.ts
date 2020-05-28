import { Operators, FieldSchema, DefaultFieldDefinitions } from '../types';
import { IDField } from './IDField';
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { DateField } from './DateField';
import { BooleanField } from './BooleanField';

export const defaultFieldSchema: FieldSchema<DefaultFieldDefinitions> = {
  id: {
    operators: [Operators.IS, Operators.IS_NOT],
    render: IDField,
  },
  string: {
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
  number: {
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
  date: {
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
  boolean: {
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
