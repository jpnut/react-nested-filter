import React from 'react';
import { Components } from '../types';

export const defaultComponents: Components = {
  Container: ({ children, ...rest }) => (
    <div className="rnf-builder__container" {...rest}>
      {children}
    </div>
  ),
  FilterButton: ({ children, filter, ...rest }) => (
    <button className="rnf-builder__button" onClick={filter} {...rest}>
      {children}
    </button>
  ),
  GroupContainer: ({ children, ...rest }) => (
    <div className="rnf-builder__group" {...rest}>
      {children}
    </div>
  ),
  GroupHeader: ({ children, ...rest }) => (
    <div className="rnf-builder__group-header" {...rest}>
      {children}
    </div>
  ),
  GroupTitle: ({ children, ...rest }) => (
    <h3 className="rnf-builder__group-title" {...rest}>
      {children}
    </h3>
  ),
  GroupRemoveButton: ({ children, removeGroup, ...rest }) => (
    <button className="rnf-builder__button" onClick={removeGroup} {...rest}>
      {children}
    </button>
  ),
  GroupOptionsContainer: ({ children, ...rest }) => (
    <div className="rnf-builder__group-options" {...rest}>
      {children}
    </div>
  ),
  AddGroupDropdown: ({ addGroup, options, ...rest }) => {
    const handleAddGroup = ({
      target: { value },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      if (value === 'none') {
        return;
      }

      addGroup(value);
    };

    return (
      <select
        className="rnf-builder__group-option rnf-builder__select"
        onChange={handleAddGroup}
        value="none"
        {...rest}
      >
        <option value="none">--</option>
        {Object.keys(options).map(option => (
          <option key={option} value={option}>
            {options[option]}
          </option>
        ))}
      </select>
    );
  },
  InclusivityDropdown: ({ inclusive, setInclusivity, ...rest }) => {
    const handleSetInclusivity = ({
      target: { value },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      setInclusivity(value === 'and');
    };

    return (
      <select
        className="rnf-builder__group-option rnf-builder__select"
        value={inclusive ? 'and' : 'or'}
        onChange={handleSetInclusivity}
        {...rest}
      >
        <option value="and">AND</option>
        <option value="or">OR</option>
      </select>
    );
  },
  AddRuleButton: ({ addRule, ...rest }) => (
    <button
      className="rnf-builder__group-option rnf-builder__button"
      onClick={addRule}
      {...rest}
    >
      Add Rule
    </button>
  ),
  GroupRulesContainer: ({ children, ...rest }) => (
    <div className="rnf-builder__group-rules" {...rest}>
      {children}
    </div>
  ),
  RuleContainer: ({ children, ...rest }) => (
    <div className="rnf-builder__rule" {...rest}>
      {children}
    </div>
  ),
  RuleSelect: ({ resource, field, setRuleField, options, ...rest }) => {
    const handleChangeField = ({
      target: { value },
    }: React.ChangeEvent<HTMLSelectElement>) => {
      setRuleField(value);
    };

    return (
      <select
        className="rnf-builder__rule-select rnf-builder__select"
        value={field}
        onChange={handleChangeField}
        {...rest}
      >
        {options.map(({ key, value }) => (
          <option key={`${resource}-${key}`} value={key}>
            {value}
          </option>
        ))}
      </select>
    );
  },
  RuleField: ({ children, ...rest }) => (
    <div className="rnf-builder__rule-field" {...rest}>
      {children}
    </div>
  ),
  RuleRemoveButton: ({ children, removeRule, ...rest }) => (
    <button
      className="rnf-builder__rule-remove rnf-builder__button"
      onClick={removeRule}
      {...rest}
    >
      {children}
    </button>
  ),
};
