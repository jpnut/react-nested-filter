import * as React from 'react';
import { FieldProps } from '../types';
import { operatorToString, nullOperator } from '../utils';
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
        operatorToString={operatorToString}
      />
      <div style={styles}>
        <input type="text" value={value || ''} onChange={handleChange} />
      </div>
    </>
  );
};
