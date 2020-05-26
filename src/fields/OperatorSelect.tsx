import * as React from 'react';
import { Operators } from '../types';
import { operatorToString as defaultOperatorToString } from '../utils';

interface Props {
  operator: Operators;
  setOperator: (operator: Operators) => void;
  operators: Operators[];
  operatorToString?: (operator: Operators) => string;
}

export const OperatorSelect: React.SFC<Props> = ({
  operator,
  setOperator,
  operators,
  operatorToString = defaultOperatorToString,
}) => {
  const handleChangeOperator = ({
    target: { value: operator },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setOperator(operator as Operators);
  };

  return (
    <div>
      <select value={operator} onChange={handleChangeOperator}>
        {operators.map(op => (
          <option key={op} value={op}>
            {operatorToString(op)}
          </option>
        ))}
      </select>
    </div>
  );
};
