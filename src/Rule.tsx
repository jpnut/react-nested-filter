import * as React from 'react';
import {
  Rule as RuleType,
  State,
  Schema,
  FieldSchema,
  Operators,
} from './types';
import { removeRule, updateRule, ruleInitializer, nullOperator } from './utils';

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
  const resource = state.groups[group].resource;
  const fields = schema[resource].fields;

  if (!fields) {
    return null;
  }

  const handleChangeField = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    const newRule = ruleInitializer(
      schema,
      fieldSchema,
      resource,
      value as string
    );

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

  return (
    <div>
      <select value={name} onChange={handleChangeField}>
        {Object.keys(fields).map(key => (
          <option key={`${resource}-${key}`} value={key}>
            {fields[key].name || startCase(key)}
          </option>
        ))}
      </select>
      <field.render
        value={value}
        setValue={setValue}
        operator={operator}
        setOperator={setOperator}
        operators={field.operators}
      />
      <button onClick={handleRemoveRule}>x</button>
    </div>
  );
};
