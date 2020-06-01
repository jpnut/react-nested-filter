import * as React from 'react';
import { FieldProps, Operators } from '../types';
import {
  operatorToString as defaultOperatorToString,
  nullOperator,
} from '../utils';
import { OperatorSelect } from './OperatorSelect';

const operatorToString = (operator: string) => {
  switch (operator) {
    case Operators.GREATER_THAN:
      return 'after';
    case Operators.GREATER_THAN_OR_EQUAL_TO:
      return 'on or after';
    case Operators.LESS_THAN:
      return 'before';
    case Operators.LESS_THAN_OR_EQUAL_TO:
      return 'on or before';
    default:
      return defaultOperatorToString(operator);
  }
};

export const DateField: React.SFC<FieldProps> = ({
  value,
  setValue,
  operator,
  setOperator,
  operators,
}) => {
  const handleChange = ({
    target: { value: newValue },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(newValue);
  };

  const styles: React.CSSProperties = nullOperator(operator)
    ? { display: 'none' }
    : {};

  return (
    <>
      <OperatorSelect
        operator={operator}
        setOperator={setOperator}
        operators={operators}
        operatorToString={operatorToString}
      />
      <div style={styles} className="rnf-builder__rule-input-wrapper">
        <input
          className="rnf-builder__rule-input rnf-builder__input"
          type="date"
          value={value}
          onChange={handleChange}
        />
      </div>
    </>
  );
};
