import * as React from 'react';
import { FieldProps } from '../types';
import { operatorToString, isNil, nullOperator } from '../utils';
import { OperatorSelect } from './OperatorSelect';

const toNumber = (value: any) =>
  typeof value === 'number' ? value : Number(value);

export const NumberField: React.SFC<FieldProps> = ({
  value,
  setValue,
  operator,
  setOperator,
  operators,
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
        operatorToString={operatorToString}
      />
      <div style={styles}>
        <input
          type="number"
          value={isNil(value) ? '' : value}
          onChange={handleChange}
        />
      </div>
    </>
  );
};
