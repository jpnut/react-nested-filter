import * as React from 'react';
import {
  Rule as RuleType,
  Schema,
  State,
  FieldTypeDefinition,
  Components,
  FieldSchema,
  Group,
} from './types';
import { removeRule, updateRule, ruleInitializer } from './utils';

interface Props<R extends string, F extends FieldTypeDefinition>
  extends RuleType {
  rule: string;
  setState: (callback: (state: State<R>) => State<R>) => void;
  schema: Schema<R, F>;
  components: Components;
  fieldSchema: FieldSchema<F>;
  isNullOperator: (operator: string) => boolean;
  getGroup: (key: string) => Group<R>;
}

const startCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const Rule = <R extends string, F extends FieldTypeDefinition>({
  group,
  name,
  operator,
  value,
  rule,
  setState,
  schema,
  components,
  fieldSchema,
  isNullOperator,
  getGroup,
}: Props<R, F>) => {
  const { RuleContainer, RuleSelect, RuleField, RuleRemoveButton } = components;
  const { resource } = getGroup(group);
  const fields = schema[resource].fields;

  if (!fields) {
    return null;
  }

  const handleChangeField = (field: string) => {
    const newRule = ruleInitializer(schema, fieldSchema, resource, field);

    if (!newRule) {
      return;
    }

    setState(state => updateRule(state, rule, newRule));
  };

  const setOperator = (operator: string) => {
    const newValue = isNullOperator(operator) ? null : value;

    setState(state => updateRule(state, rule, { operator, value: newValue }));
  };

  const setValue = (value?: any) => {
    setState(state => updateRule(state, rule, { value }));
  };

  const handleRemoveRule = () => {
    setState(state => removeRule(state, rule));
  };

  const Field = fieldSchema && fieldSchema[fields[name].type];

  if (!Field) {
    return null;
  }

  const fieldOptions = Object.keys(fields).map(key => ({
    key,
    value: fields[key].name || startCase(key),
  }));

  const props = fields[name].fieldProps;

  return (
    <RuleContainer>
      <RuleSelect
        resource={resource}
        field={name}
        setRuleField={handleChangeField}
        options={fieldOptions}
      />
      <RuleField>
        <Field.render
          value={value}
          setValue={setValue}
          operator={operator}
          setOperator={setOperator}
          operators={Field.operators}
          {...(props as F[keyof F])}
        />
      </RuleField>
      <RuleRemoveButton removeRule={handleRemoveRule}>x</RuleRemoveButton>
    </RuleContainer>
  );
};
