import * as React from 'react';
import {
  Rule as RuleType,
  Schema,
  State,
  FieldTypeDefinition,
  Components,
  FieldSchema,
} from './types';
import { removeRule, updateRule, ruleInitializer } from './utils';

interface Props<R extends string, F extends FieldTypeDefinition>
  extends RuleType {
  rule: string;
  state: State<R>;
  setState: React.Dispatch<React.SetStateAction<State<R>>>;
  schema: Schema<R, F>;
  components: Components;
  fieldSchema: FieldSchema<F>;
  isNullOperator: (operator: string) => boolean;
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
  state,
  setState,
  schema,
  components,
  fieldSchema,
  isNullOperator,
}: Props<R, F>) => {
  const { RuleContainer, RuleSelect, RuleField, RuleRemoveButton } = components;

  const resource = state.groups[group].resource;
  const fields = schema[resource].fields;

  if (!fields) {
    return null;
  }

  const handleChangeField = (field: string) => {
    const newRule = ruleInitializer(schema, fieldSchema, resource, field);

    if (!newRule) {
      return;
    }

    setState(updateRule(state, rule, newRule));
  };

  const setOperator = (operator: string) => {
    const newValue = isNullOperator(operator) ? null : value;

    setState(updateRule(state, rule, { operator, value: newValue }));
  };

  const setValue = (value?: any) => {
    setState(updateRule(state, rule, { value }));
  };

  const handleRemoveRule = () => {
    setState(removeRule(state, rule));
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
