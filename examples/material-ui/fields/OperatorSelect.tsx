import * as React from 'react';
import { Box, NativeSelect } from '@material-ui/core';
import {
  Operators,
  operatorToString as defaultOperatorToString,
} from '../../../';

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
    <Box mr={2}>
      <NativeSelect
        className="rnf-builder__operator-select rnf-builder__select"
        value={operator}
        onChange={handleChangeOperator}
      >
        {operators.map(op => (
          <option key={op} value={op}>
            {operatorToString(op)}
          </option>
        ))}
      </NativeSelect>
    </Box>
  );
};
