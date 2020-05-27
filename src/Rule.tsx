import * as React from 'react';
import {
  FieldSchema,
  Operators,
  Rule as RuleType,
  Schema,
  State,
} from './types';
import { removeRule, updateRule, ruleInitializer, nullOperator } from './utils';
import { ComponentContext } from './components';

interface Props<R extends string> extends RuleType {
  rule: string;
  state: State<R>;
  setState: React.Dispatch<React.SetStateAction<State<R>>>;
  schema: Schema<R>;
  fieldSchema: FieldSchema;
}

const startCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const Rule = <R extends string>({
  group,
  name,
  operator,
  value,
  rule,
  state,
  setState,
  schema,
  fieldSchema,
}: Props<R>) => {
  const {
    RuleContainer,
    RuleSelect,
    RuleField,
    RuleRemoveButton,
  } = React.useContext(ComponentContext);

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

  const setOperator = (operator: Operators) => {
    const newValue = nullOperator(operator) ? null : value;

    setState(updateRule(state, rule, { operator, value: newValue }));
  };

  const setValue = (value?: any) => {
    setState(updateRule(state, rule, { value }));
  };

  const handleRemoveRule = () => {
    setState(removeRule(state, rule));
  };

  const field = fieldSchema[fields[name].type];

  const fieldOptions = Object.keys(fields).map(key => ({
    key,
    value: fields[key].name || startCase(key),
  }));

  return (
    <RuleContainer>
      <RuleSelect
        resource={resource}
        field={name}
        setRuleField={handleChangeField}
        options={fieldOptions}
      />
      <RuleField>
        <field.render
          value={value}
          setValue={setValue}
          operator={operator}
          setOperator={setOperator}
          operators={field.operators}
        />
      </RuleField>
      <RuleRemoveButton removeRule={handleRemoveRule}>x</RuleRemoveButton>
    </RuleContainer>
  );
};
