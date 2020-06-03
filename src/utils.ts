import { Record as IRecord } from 'immutable';
import {
  FieldSchema,
  Operators,
  Rule,
  Schema,
  FieldTypeDefinition,
  StateRecord,
  BranchRecord,
  Leaf,
} from './types';

const Branch = IRecord<BranchRecord>(({
  id: undefined,
  inclusive: true,
  resource: undefined,
  rules: {},
  groups: {},
  path: [],
} as unknown) as BranchRecord);

const Leaf = IRecord<Leaf>(({
  id: undefined,
  name: undefined,
  operator: undefined,
  value: undefined,
  path: [],
} as unknown) as Leaf);

const State = IRecord<StateRecord>({
  counter: 0,
  tree: Branch(),
});

const createGroup = <R extends string>(
  resource: R,
  id: string,
  path: string[]
): IRecord<BranchRecord> => {
  return Branch({
    id,
    inclusive: true,
    resource,
    rules: {},
    groups: {},
    path,
  });
};

const addGroup = <R extends string>(
  state: IRecord<StateRecord>,
  resource: R,
  basePath: string[]
): IRecord<StateRecord> => {
  const id = state.get('counter');
  const path = [...basePath, 'groups', `${id}`];

  return state
    .set('counter', id + 1)
    .setIn(path, createGroup(resource, `${id}`, path));
};

const updateGroup = (
  state: IRecord<StateRecord>,
  path: string[],
  properties: Pick<BranchRecord, 'inclusive'>
): IRecord<StateRecord> => {
  return state.updateIn(path, (group: IRecord<BranchRecord>) =>
    group.merge(properties)
  );
};

const removeGroup = (
  state: IRecord<StateRecord>,
  path: string[]
): IRecord<StateRecord> => {
  if (path.length <= 1) {
    return state;
  }

  return state.removeIn(path);
};

const createRule = (
  id: string,
  path: string[],
  rule: Omit<Rule, 'group'>
): IRecord<Leaf> => {
  return Leaf({
    id,
    path,
    ...rule,
  });
};

const addRule = (
  state: IRecord<StateRecord>,
  rule: Omit<Rule, 'group'>,
  basePath: string[]
): IRecord<StateRecord> => {
  const id = state.get('counter');
  const path = [...basePath, 'rules', `${id}`];

  return state
    .set('counter', id + 1)
    .setIn(path, createRule(`${id}`, path, rule));
};

const updateRule = (
  state: IRecord<StateRecord>,
  path: string[],
  properties: Partial<Pick<Rule, 'value' | 'name' | 'operator'>>
): IRecord<StateRecord> => {
  return state.updateIn(path, (rule: IRecord<Leaf>) => rule.merge(properties));
};

const removeRule = (
  state: IRecord<StateRecord>,
  path: string[]
): IRecord<StateRecord> => {
  if (path.length <= 1) {
    return state;
  }

  return state.removeIn(path);
};

const initialState = <R extends string>(resource: R): IRecord<StateRecord> => {
  return State({
    counter: 1,
    tree: createGroup(resource, '0', ['tree']),
  });
};

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

export {
  initialState,
  addGroup,
  updateGroup,
  removeGroup,
  addRule,
  updateRule,
  removeRule,
  ruleInitializer,
  operatorToString,
  nullOperator,
  isNil,
  invert,
};
