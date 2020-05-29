import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { FieldProps, nullOperator, NumberFieldProps, isNil } from '../../../';
import { OperatorSelect } from './OperatorSelect';

const toNumber = (value: any) =>
  typeof value === 'number' ? value : Number(value);

export const NumberField: React.SFC<FieldProps & NumberFieldProps> = ({
  value,
  setValue,
  operator,
  setOperator,
  operators,
  step,
  min,
  max,
}) => {
  const handleChange = ({
    target: { value: newValue },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (isNil(newValue) || newValue === '') {
      return setValue(undefined);
    }

    setValue(toNumber(newValue));
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
          type="number"
          value={isNil(value) ? '' : value}
          onChange={handleChange}
          fullWidth
          inputProps={{
            step,
            min,
            max,
          }}
        />
      </Box>
    </>
  );
};
