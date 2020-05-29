import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { FieldProps, nullOperator } from '../../../';
import { OperatorSelect } from './OperatorSelect';

export const IDField: React.SFC<FieldProps> = ({
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
      />
      <Box display="flex" flex={1} style={styles}>
        <TextField
          type="text"
          value={value || ''}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </>
  );
};
