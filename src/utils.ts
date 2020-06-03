import {
  FieldSchema,
  Operators,
  Rule,
  Schema,
  FieldTypeDefinition,
} from './types';

const ruleInitializer = <R extends string, F extends FieldTypeDefinition>(
  schema: Schema<R, F>,
  fieldSchema: FieldSchema<F>,
  resource: R,
  name: string
): Pick<Rule, 'name' | 'operator' | 'value'> | undefined => {
  const fields = schema[resource].fields;

  if (!fields) {
    return;
  }

  const field = fields[name];

  if (!field) {
    return;
  }

  const defaultValueFunc = fieldSchema[field.type].defaultValue;

  return {
    name,
    operator: fieldSchema[field.type].operators[0],
    value: (defaultValueFunc && defaultValueFunc()) || undefined,
  };
};

const operatorToString = (operator: string) => {
  switch (operator) {
    case Operators.IS:
      return 'equals';
    case Operators.IS_NOT:
      return 'does not equal';
    case Operators.LIKE:
      return 'is like';
    case Operators.NOT_LIKE:
      return 'is not like ';
    case Operators.CONTAINS:
      return 'contains';
    case Operators.DOES_NOT_CONTAIN:
      return 'does not contain';
    case Operators.BEGINS:
      return 'begins with';
    case Operators.DOES_NOT_BEGIN:
      return 'does not begin within';
    case Operators.ENDS:
      return 'ends with';
    case Operators.DOES_NOT_END:
      return 'does not end with';
    case Operators.LESS_THAN:
      return 'less than';
    case Operators.LESS_THAN_OR_EQUAL_TO:
      return 'less than or equal to';
    case Operators.GREATER_THAN:
      return 'greater than';
    case Operators.GREATER_THAN_OR_EQUAL_TO:
      return 'greater than or equal to';
    case Operators.NULL:
      return 'is null';
    case Operators.NOT_NULL:
      return 'is not null';
    default:
      return operator;
  }
};

const nullOperator = (operator: string) =>
  operator === Operators.NULL || operator === Operators.NOT_NULL;

const isNil = (value: any) => value === null || value === undefined;

const invert = (obj: { [x: string]: string }) => {
  const newObj: { [x: string]: string } = {};

  Object.keys(obj).forEach(key => {
    newObj[obj[key]] = key;
  });

  return newObj;
};

export { ruleInitializer, operatorToString, nullOperator, isNil, invert };
