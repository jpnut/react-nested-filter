import * as React from 'react';
import { FieldProps, NumberFieldProps } from '../types';
import { operatorToString, isNil, nullOperator } from '../utils';
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
        operatorToString={operatorToString}
      />
      <div style={styles} className="rnf-builder__rule-input-wrapper">
        <input
          className="rnf-builder__rule-input rnf-builder__input"
          type="number"
          value={isNil(value) ? '' : value}
          onChange={handleChange}
          step={step}
          min={min}
          max={max}
        />
      </div>
    </>
  );
};
