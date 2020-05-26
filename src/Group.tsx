import * as React from 'react';
import {
  addRule,
  addGroup,
  updateGroup,
  ruleInitializer,
  removeGroup,
} from './utils';
import {
  Group as GroupType,
  State,
  Schema,
  SubGroupOptions,
  FieldSchema,
} from './types';
import { Rule } from './Rule';

interface Props<R extends string> extends GroupType<R> {
  group: string;
  state: State<R>;
  setState: React.Dispatch<React.SetStateAction<State<R>>>;
  schema: Schema<R>;
  fieldSchema: FieldSchema;
}

const invert = (obj: { [x: string]: string }) => {
  const newObj: { [x: string]: string } = {};

  Object.keys(obj).forEach(key => {
    newObj[obj[key]] = key;
  });

  return newObj;
};

export const Group = <R extends string>({
  children,
  rules,
  inclusive,
  resource,
  group,
  state,
  setState,
  schema,
  fieldSchema,
}: Props<R>) => {
  const fields = schema[resource].fields;
  const relations = schema[resource].relations;
  const subGroupOptions = {
    [resource]: resource,
    ...invert(relations || {}),
  } as SubGroupOptions<R>;

  const handleUpdateGroup = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setState(updateGroup(state, group, { inclusive: !!value }));
  };

  const handleRemoveGroup = () => {
    setState(removeGroup(state, group));
  };

  const handleAddRule = () => {
    if (!fields) {
      return;
    }

    const rule = ruleInitializer(
      schema,
      fieldSchema,
      resource,
      Object.keys(fields)[0]
    );

    if (!rule) {
      return;
    }

    setState(addRule(state, { group, ...rule }));
  };

  const handleAddGroup = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setState(addGroup(state, value as R, group));
  };

  return (
    <div>
      <h4>Resource: {resource}</h4>
      <button onClick={handleRemoveGroup}>x</button>
      <div>
        <select onChange={handleAddGroup}>
          <option value={undefined}>--</option>
          {(Object.keys(subGroupOptions) as R[]).map(option => (
            <option key={option} value={option}>
              {subGroupOptions[option]}
            </option>
          ))}
        </select>
        <select value={inclusive ? 1 : 0} onChange={handleUpdateGroup}>
          <option value={1}>AND</option>
          <option value={0}>OR</option>
        </select>
        <button onClick={handleAddRule}>Add Rule</button>
      </div>
      <div>
        {rules.map(rule => (
          <Rule
            key={rule}
            {...state.rules[rule]}
            rule={rule}
            state={state}
            setState={setState}
            schema={schema}
            fieldSchema={fieldSchema}
          />
        ))}
        {children.map(child => (
          <Group
            key={child}
            {...state.groups[child]}
            group={child}
            state={state}
            setState={setState}
            schema={schema}
            fieldSchema={fieldSchema}
          />
        ))}
      </div>
    </div>
  );
};
