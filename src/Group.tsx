import * as React from 'react';
import { Record } from 'immutable';
import { Rule } from './Rule';
import {
  invert,
  ruleInitializer,
  addGroup,
  addRule,
  removeGroup,
  updateGroup,
} from './utils';
import {
  Components,
  FieldSchema,
  FieldTypeDefinition,
  Schema,
  SubGroupOptions,
  BranchRecord,
  StateRecord,
} from './types';

interface Props<R extends string, F extends FieldTypeDefinition> {
  group: Record<BranchRecord>;
  setState: (
    callback: (state: Record<StateRecord>) => Record<StateRecord>
  ) => void;
  schema: Schema<R, F>;
  components: Components;
  fieldSchema: FieldSchema<F>;
  isNullOperator: (operator: string) => boolean;
}

export const Group = <R extends string, F extends FieldTypeDefinition>(
  props: Props<R, F>
) => {
  const {
    group,
    setState,
    schema,
    components,
    fieldSchema,
    isNullOperator,
  } = props;

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
  } = components;

  const resource = group.get('resource') as R;
  const fields = schema[resource].fields;
  const relations = schema[resource].relations;
  const subGroupOptions = {
    [resource]: resource,
    ...invert(relations || {}),
  } as SubGroupOptions<R>;

  const handleSetInclusivity = (newInclusive: boolean) => {
    setState(state =>
      updateGroup(state, group.get('path'), { inclusive: newInclusive })
    );
  };

  const handleRemoveGroup = () => {
    setState(state => removeGroup(state, group.get('path')));
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

    setState(state => addRule(state, rule, group.get('path')));
  };

  const handleAddGroup = (value: string) => {
    setState(state => addGroup(state, value as R, group.get('path')));
  };

  const rules = group.get('rules');
  const groups = group.get('groups');

  return (
    <GroupContainer>
      <GroupHeader>
        <GroupTitle>Resource: {resource}</GroupTitle>
        <GroupRemoveButton removeGroup={handleRemoveGroup}>x</GroupRemoveButton>
      </GroupHeader>
      <GroupOptionsContainer>
        <InclusivityDropdown
          inclusive={group.get('inclusive')}
          setInclusivity={handleSetInclusivity}
        />
        <AddGroupDropdown addGroup={handleAddGroup} options={subGroupOptions} />
        <AddRuleButton addRule={handleAddRule} />
      </GroupOptionsContainer>
      <GroupRulesContainer>
        {Object.keys(rules).map(key => (
          <Rule
            key={key}
            rule={rules[key]}
            resource={resource}
            setState={setState}
            schema={schema}
            components={components}
            fieldSchema={fieldSchema}
            isNullOperator={isNullOperator}
          />
        ))}
        {Object.keys(groups).map(key => (
          <Group
            key={key}
            group={groups[key]}
            setState={setState}
            schema={schema}
            components={components}
            fieldSchema={fieldSchema}
            isNullOperator={isNullOperator}
          />
        ))}
      </GroupRulesContainer>
    </GroupContainer>
  );
};
