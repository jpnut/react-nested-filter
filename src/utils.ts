import {
  FieldSchema,
  Group,
  Groups,
  Operators,
  Rule,
  Rules,
  Schema,
  State,
  FieldTypeDefinition,
} from './types';

let counter = 0;

const createKeyedRule = (rule: Rule): Rules => ({
  [counter++]: rule,
});

const addRule = <R extends string>(
  { groups, rules, ...state }: State<R>,
  { group, ...rest }: Rule
): State<R> => {
  const newRule = createKeyedRule({ group, ...rest });

  return {
    groups: {
      ...groups,
      [group]: {
        ...groups[group],
        rules: groups[group].rules.concat(Object.keys(newRule)),
      },
    },
    rules: {
      ...rules,
      ...newRule,
    },
    ...state,
  };
};

const updateRule = <R extends string>(
  { rules, ...state }: State<R>,
  key: string,
  properties: Partial<Pick<Rule, 'value' | 'name' | 'operator'>>
): State<R> => {
  return {
    rules: {
      ...rules,
      [key]: {
        ...rules[key],
        ...properties,
      },
    },
    ...state,
  };
};

const removeRule = <R extends string>(
  { groups, rules, ...state }: State<R>,
  key: string
): State<R> => {
  const {
    [key]: { group },
    ...rest
  } = rules;

  return {
    groups: {
      ...groups,
      [group]: {
        ...groups[group],
        rules: groups[group].rules.filter(f => f !== key),
      },
    },
    rules: {
      ...rest,
    },
    ...state,
  };
};

const createGroup = <R extends string>(
  resource: R,
  parent?: string
): Group<R> => ({
  children: [],
  rules: [],
  inclusive: true,
  parent,
  resource,
});

const createKeyedGroup = <R extends string>(
  resource: R,
  parent?: string
): Groups<R> => ({
  [counter++]: createGroup(resource, parent),
});

const addGroup = <R extends string>(
  { groups, ...state }: State<R>,
  resource: R,
  parent: string
): State<R> => {
  const newGroup = createKeyedGroup(resource, parent);
  const keys = Object.keys(newGroup);

  return {
    groups: {
      ...groups,
      [parent]: {
        ...groups[parent],
        children: groups[parent].children.concat(keys),
      },
      ...newGroup,
    },
    ...state,
  };
};

const updateGroup = <R extends string>(
  { groups, ...state }: State<R>,
  key: string,
  properties: Pick<Group<R>, 'inclusive'>
): State<R> => {
  return {
    groups: {
      ...groups,
      [key]: {
        ...groups[key],
        ...properties,
      },
    },
    ...state,
  };
};

const removeGroup = <R extends string>(
  { groups, rules, ...state }: State<R>,
  key: string,
  nested = false
): State<R> => {
  const {
    [key]: { children, rules: groupRules, parent },
    ...rest
  } = groups;

  // can't delete root group.
  if (!parent || key === state.root) {
    return { groups, rules, ...state };
  }

  // remove the group from the groups object and from the children array in the parent group
  const newGroups = nested
    ? rest
    : {
        ...rest,
        [parent]: {
          ...rest[parent],
          children: rest[parent].children.filter(g => g !== key),
        },
      };

  let newState = { ...state, groups: newGroups, rules };

  groupRules.forEach(rule => {
    const { [rule]: _removedRule, ...newRules } = newState.rules;

    newState = { ...newState, rules: newRules };
  });

  children.forEach(child => {
    newState = removeGroup(newState, child, true);
  });

  return newState;
};

const initialState = <R extends string>(resource: R): State<R> => {
  const groups = createKeyedGroup(resource);
  const root = Object.keys(groups)[0];

  return {
    groups,
    rules: {},
    root,
  };
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

  const defaultValueFunc =
    fieldSchema[field.type as keyof FieldSchema<F>].defaultValue;

  return {
    name,
    operator: fieldSchema[field.type as keyof FieldSchema<F>].operators[0],
    value: (defaultValueFunc && defaultValueFunc()) || undefined,
  };
};

const operatorToString = (operator: Operators) => {
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
  }
};

const nullOperator = (operator: Operators) =>
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
  addRule,
  updateRule,
  removeRule,
  createGroup,
  createKeyedGroup,
  addGroup,
  updateGroup,
  removeGroup,
  initialState,
  ruleInitializer,
  operatorToString,
  nullOperator,
  isNil,
  invert,
};
