import * as React from 'react';
import { Rule } from './Rule';
import {
  addGroup,
  addRule,
  invert,
  removeGroup,
  ruleInitializer,
  updateGroup,
} from './utils';
import {
  Group as GroupType,
  Schema,
  State,
  SubGroupOptions,
  FieldTypeDefinition,
  Components,
  FieldSchema,
  Rule as RuleType,
} from './types';

interface Props<R extends string, F extends FieldTypeDefinition>
  extends GroupType<R> {
  group: string;
  setState: (callback: (state: State<R>) => State<R>) => void;
  schema: Schema<R, F>;
  components: Components;
  fieldSchema: FieldSchema<F>;
  isNullOperator: (operator: string) => boolean;
  getGroup: (key: string) => GroupType<R>;
  getRule: (key: string) => RuleType;
}

export const Group = <R extends string, F extends FieldTypeDefinition>(
  props: Props<R, F>
) => {
  const {
    children,
    rules,
    inclusive,
    resource,
    group,
    setState,
    schema,
    components,
    fieldSchema,
    isNullOperator,
    getGroup,
    getRule,
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

  const fields = schema[resource].fields;
  const relations = schema[resource].relations;
  const subGroupOptions = {
    [resource]: resource,
    ...invert(relations || {}),
  } as SubGroupOptions<R>;

  const handleSetInclusivity = (newInclusive: boolean) => {
    setState(state => updateGroup(state, group, { inclusive: newInclusive }));
  };

  const handleRemoveGroup = () => {
    setState(state => removeGroup(state, group));
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

    setState(state => addRule(state, { group, ...rule }));
  };

  const handleAddGroup = (value: string) => {
    setState(state => addGroup(state, value as R, group));
  };

  return (
    <GroupContainer>
      <GroupHeader>
        <GroupTitle>Resource: {resource}</GroupTitle>
        <GroupRemoveButton removeGroup={handleRemoveGroup}>x</GroupRemoveButton>
      </GroupHeader>
      <GroupOptionsContainer>
        <InclusivityDropdown
          inclusive={inclusive}
          setInclusivity={handleSetInclusivity}
        />
        <AddGroupDropdown addGroup={handleAddGroup} options={subGroupOptions} />
        <AddRuleButton addRule={handleAddRule} />
      </GroupOptionsContainer>
      <GroupRulesContainer>
        {rules.map(rule => (
          <Rule
            key={rule}
            {...getRule(rule)}
            rule={rule}
            setState={setState}
            schema={schema}
            components={components}
            fieldSchema={fieldSchema}
            isNullOperator={isNullOperator}
            getGroup={getGroup}
          />
        ))}
        {children.map(child => (
          <Group
            key={child}
            {...getGroup(child)}
            group={child}
            setState={setState}
            schema={schema}
            components={components}
            fieldSchema={fieldSchema}
            isNullOperator={isNullOperator}
            getGroup={getGroup}
            getRule={getRule}
          />
        ))}
      </GroupRulesContainer>
    </GroupContainer>
  );
};
