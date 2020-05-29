import * as React from 'react';
import { Box } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { formatISO, parseISO } from 'date-fns';
import {
  FieldProps,
  nullOperator,
  operatorToString as defaultOperatorToString,
  Operators,
  isNil,
} from '../../../';
import { OperatorSelect } from './OperatorSelect';

const operatorToString = (operator: Operators) => {
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

const dateToString = (date?: Date) => (date && formatISO(date)) || undefined;

const dateFromString = (date?: string) => (date && parseISO(date)) || undefined;

export const DateField: React.SFC<FieldProps> = ({
  value,
  setValue,
  operator,
  setOperator,
  operators,
}) => {
  const handleChange = (date: Date) => {
    setValue(dateToString(date));
  };

  const selectedDate = React.useMemo(
    () => (isNil(value) ? null : dateFromString(value)),
    [value]
  );

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
        <DatePicker
          clearable={true}
          value={selectedDate}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </>
  );
};
