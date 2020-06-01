import * as React from 'react';
import { FieldProps, Operators } from '../types';
import {
  operatorToString as defaultOperatorToString,
  nullOperator,
} from '../utils';
import { OperatorSelect } from './OperatorSelect';

const operatorToString = (operator: string) => {
  switch (operator) {
    case Operators.IS:
      return 'is';
    case Operators.IS_NOT:
      return 'is not';
    default:
      return defaultOperatorToString(operator);
  }
};

export const BooleanField: React.SFC<FieldProps> = ({
  value,
  setValue,
  operator,
  setOperator,
  operators,
}) => {
  const handleChange = ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(checked);
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
          className="rnf-builder__rule-checkbox rnf-builder__input"
          type="checkbox"
          checked={!!value}
          onChange={handleChange}
        />
      </div>
    </>
  );
};
