import * as React from 'react';
import { Box, Slider } from '@material-ui/core';
import { FieldProps, nullOperator, NumberFieldProps, isNil } from '../../../';
import { OperatorSelect } from './OperatorSelect';

const toNumber = (value: any) =>
  typeof value === 'number' ? value : Number(value);

export const RangeField: React.SFC<FieldProps & NumberFieldProps> = ({
  value,
  setValue,
  operator,
  setOperator,
  operators,
  step,
  min,
  max,
}) => {
  const [state, setState] = React.useState(value);

  const handleChange = (event, newValue: number) => {
    setState(newValue);

    handleValueChange(newValue);
  };

  const handleValueChange = (newValue: number) => {
    if (isNil(newValue)) {
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
        <Slider
          value={isNil(state) ? 0 : state}
          onChange={handleChange}
          step={step}
          min={min}
          max={max}
        />
      </Box>
    </>
  );
};
