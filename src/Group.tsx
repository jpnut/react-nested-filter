import * as React from 'react';
import { ComponentContext } from './components';
import {
  addGroup,
  addRule,
  invert,
  removeGroup,
  ruleInitializer,
  updateGroup,
} from './utils';
import {
  FieldSchema,
  Group as GroupType,
  Schema,
  State,
  SubGroupOptions,
} from './types';
import { Rule } from './Rule';

interface Props<R extends string> extends GroupType<R> {
  group: string;
  state: State<R>;
  setState: React.Dispatch<React.SetStateAction<State<R>>>;
  schema: Schema<R>;
  fieldSchema: FieldSchema;
}

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
  const {
    GroupContainer,
    GroupHeader,
    GroupTitle,
    GroupRemoveButton,
    GroupOptionsContainer,
    AddGroupDropdown,
    InclusivityDropdown,
    AddRuleButton,
    GroupRulesContainer,
  } = React.useContext(ComponentContext);

  const fields = schema[resource].fields;
  const relations = schema[resource].relations;
  const subGroupOptions = {
    [resource]: resource,
    ...invert(relations || {}),
  } as SubGroupOptions<R>;

  const handleSetInclusivity = (newInclusive: boolean) => {
    setState(updateGroup(state, group, { inclusive: newInclusive }));
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

  const handleAddGroup = (value: string) => {
    setState(addGroup(state, value as R, group));
  };

  return (
    <GroupContainer>
      <GroupHeader>
        <GroupTitle>Resource: {resource}</GroupTitle>
        <GroupRemoveButton removeGroup={handleRemoveGroup}>x</GroupRemoveButton>
      </GroupHeader>
      <GroupOptionsContainer>
        <AddGroupDropdown addGroup={handleAddGroup} options={subGroupOptions} />
        <InclusivityDropdown
          inclusive={inclusive}
          setInclusivity={handleSetInclusivity}
        />
        <AddRuleButton addRule={handleAddRule} />
      </GroupOptionsContainer>
      <GroupRulesContainer>
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
      </GroupRulesContainer>
    </GroupContainer>
  );
};
