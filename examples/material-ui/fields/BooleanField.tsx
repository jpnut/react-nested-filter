import * as React from 'react';
import { Box, Checkbox } from '@material-ui/core';
import {
  FieldProps,
  nullOperator,
  operatorToString as defaultOperatorToString,
  Operators,
} from '../../../';
import { OperatorSelect } from './OperatorSelect';

const operatorToString = (operator: Operators) => {
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
      <Box display="flex" flex={1} style={styles}>
        <Checkbox checked={!!value} onChange={handleChange} size="small" />
      </Box>
    </>
  );
};
