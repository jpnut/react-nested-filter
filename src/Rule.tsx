import * as React from 'react';
import { Record } from 'immutable';
import { Schema, FieldTypeDefinition, Components, FieldSchema } from './types';
import { ruleInitializer } from './utils';
import { Leaf, State, removeRule, updateRule } from './immutable-utils';

interface Props<R extends string, F extends FieldTypeDefinition> {
  rule: Record<Leaf>;
  resource: R;
  setState: (callback: (state: Record<State>) => Record<State>) => void;
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

export class Rule<
  R extends string,
  F extends FieldTypeDefinition
> extends React.PureComponent<Props<R, F>> {
  constructor(props: Props<R, F>) {
    super(props);
  }

  public handleChangeField = (field: string) => {
    const { schema, fieldSchema, resource, setState, rule } = this.props;

    const newRule = ruleInitializer(schema, fieldSchema, resource, field);

    if (!newRule) {
      return;
    }

    setState(state => updateRule(state, rule.get('path'), newRule));
  };

  public setOperator = (operator: string) => {
    const { isNullOperator, setState, rule } = this.props;

    const newValue = isNullOperator(operator) ? null : rule.get('value');

    setState(state =>
      updateRule(state, rule.get('path'), { operator, value: newValue })
    );
  };

  public setValue = (value?: any) => {
    const { setState, rule } = this.props;

    setState(state => updateRule(state, rule.get('path'), { value }));
  };

  public handleRemoveRule = () => {
    const { setState, rule } = this.props;

    setState(state => removeRule(state, rule.get('path')));
  };

  public render() {
    const {
      props: {
        components: { RuleContainer, RuleSelect, RuleField, RuleRemoveButton },
        resource,
        schema,
        fieldSchema,
        rule,
      },
    } = this;

    const name = rule.get('name');
    const value = rule.get('value');
    const operator = rule.get('operator');

    const fields = schema[resource].fields;

    if (!fields) {
      return null;
    }

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
          setRuleField={this.handleChangeField}
          options={fieldOptions}
        />
        <RuleField>
          <Field.render
            value={value}
            setValue={this.setValue}
            operator={operator}
            setOperator={this.setOperator}
            operators={Field.operators}
            {...(props as F[keyof F])}
          />
        </RuleField>
        <RuleRemoveButton removeRule={this.handleRemoveRule}>
          x
        </RuleRemoveButton>
      </RuleContainer>
    );
  }
}
