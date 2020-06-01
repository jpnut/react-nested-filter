import * as React from 'react';
import { operatorToString as defaultOperatorToString } from '../utils';

interface Props {
  operator: string;
  setOperator: (operator: string) => void;
  operators: string[];
  operatorToString?: (operator: string) => string;
}

export const OperatorSelect: React.SFC<Props> = ({
  operator,
  setOperator,
  operators,
  operatorToString = defaultOperatorToString,
}) => {
  const handleChangeOperator = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setOperator(value);
  };

  return (
    <div>
      <select
        className="rnf-builder__operator-select rnf-builder__select"
        value={operator}
        onChange={handleChangeOperator}
      >
        {operators.map(op => (
          <option key={op} value={op}>
            {operatorToString(op)}
          </option>
        ))}
      </select>
    </div>
  );
};
