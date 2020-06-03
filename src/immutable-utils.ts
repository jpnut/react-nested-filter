import { Record as IRecord } from 'immutable';
import { Rule } from './types';

const Branch = IRecord<Branch>(({
  id: undefined,
  inclusive: true,
  resource: undefined,
  rules: {},
  groups: {},
  path: [],
} as unknown) as Branch);

const Leaf = IRecord<Leaf>(({
  id: undefined,
  name: undefined,
  operator: undefined,
  value: undefined,
  path: [],
} as unknown) as Leaf);

const State = IRecord<State>({
  counter: 0,
  tree: Branch(),
});

export interface State {
  counter: number;
  tree: IRecord<Branch>;
}

export interface Branch {
  id: string;
  inclusive: boolean;
  resource: string;
  rules: Record<string, IRecord<Leaf>>;
  groups: Record<string, IRecord<Branch>>;
  path: string[];
}

export interface Leaf extends Omit<Rule, 'group'> {
  id: string;
  path: string[];
}

const createGroup = <R extends string>(
  resource: R,
  id: string,
  path: string[]
): IRecord<Branch> => {
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
  state: IRecord<State>,
  resource: R,
  basePath: string[]
): IRecord<State> => {
  const id = state.get('counter');
  const path = [...basePath, 'groups', `${id}`];

  return state
    .set('counter', id + 1)
    .setIn(path, createGroup(resource, `${id}`, path));
};

const updateGroup = (
  state: IRecord<State>,
  path: string[],
  properties: Pick<Branch, 'inclusive'>
): IRecord<State> => {
  return state.updateIn(path, (group: IRecord<Branch>) =>
    group.merge(properties)
  );
};

const removeGroup = (state: IRecord<State>, path: string[]): IRecord<State> => {
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
  state: IRecord<State>,
  rule: Omit<Rule, 'group'>,
  basePath: string[]
): IRecord<State> => {
  const id = state.get('counter');
  const path = [...basePath, 'rules', `${id}`];

  return state
    .set('counter', id + 1)
    .setIn(path, createRule(`${id}`, path, rule));
};

const updateRule = (
  state: IRecord<State>,
  path: string[],
  properties: Partial<Pick<Rule, 'value' | 'name' | 'operator'>>
): IRecord<State> => {
  return state.updateIn(path, (rule: IRecord<Leaf>) => rule.merge(properties));
};

const removeRule = (state: IRecord<State>, path: string[]): IRecord<State> => {
  if (path.length <= 1) {
    return state;
  }

  return state.removeIn(path);
};

const initialState = <R extends string>(resource: R): IRecord<State> => {
  return State({
    counter: 1,
    tree: createGroup(resource, '0', ['tree']),
  });
};

export {
  initialState,
  addGroup,
  updateGroup,
  removeGroup,
  addRule,
  updateRule,
  removeRule,
};
