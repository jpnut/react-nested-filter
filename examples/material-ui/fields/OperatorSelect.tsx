import * as React from 'react';
import { Box, NativeSelect } from '@material-ui/core';
import { operatorToString as defaultOperatorToString } from '../../../';

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
    <Box mr={2}>
      <NativeSelect value={operator} onChange={handleChangeOperator}>
        {operators.map(op => (
          <option key={op} value={op}>
            {operatorToString(op)}
          </option>
        ))}
      </NativeSelect>
    </Box>
  );
};
