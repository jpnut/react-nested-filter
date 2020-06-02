import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Builder } from '../stories/Builder.stories';
import {
  DefaultFieldDefinitions,
  Schema,
  addGroup,
  addRule,
  createKeyedGroup,
  createKeyedRule,
  defaultFieldSchema,
  initialState,
  removeGroup,
  removeRule,
  ruleInitializer,
  updateGroup,
  updateRule,
} from '../src';

describe('State Management', () => {
  const schema: Schema<'product', DefaultFieldDefinitions> = {
    product: {
      fields: {
        id: {
          name: 'ID',
          type: 'id',
        },
        name: {
          type: 'string',
        },
        amount: {
          type: 'number',
          fieldProps: {
            step: 0.01,
          },
        },
        available: {
          type: 'boolean',
        },
        created_at: {
          type: 'date',
        },
      },
    },
  };

  it('can initialise state', () => {
    const state = initialState('product');

    expect(state).toEqual({
      groups: {
        '0': {
          children: [],
          rules: [],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
      },
      rules: {},
      root: '0',
      counter: 1,
    });
  });

  it('can create keyed group', () => {
    const group = createKeyedGroup('product', 0);

    expect(group).toEqual({
      '0': {
        children: [],
        rules: [],
        inclusive: true,
        parent: undefined,
        resource: 'product',
      },
    });
  });

  it('can add group to state', () => {
    const state = initialState('product');

    const newState = addGroup(state, 'product', state.root);

    expect(newState).toEqual({
      groups: {
        '0': {
          children: ['1'],
          rules: [],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
        '1': {
          children: [],
          rules: [],
          inclusive: true,
          parent: '0',
          resource: 'product',
        },
      },
      rules: {},
      root: '0',
      counter: 2,
    });
  });

  it('can update group', () => {
    const state = initialState('product');

    const newState = updateGroup(state, '0', { inclusive: false });

    expect(newState.groups[0]).toEqual({
      children: [],
      rules: [],
      inclusive: false,
      parent: undefined,
      resource: 'product',
    });
  });

  it('can remove group', () => {
    const state = addGroup(initialState('product'), 'product', '0');

    const newState = removeGroup(state, '1');

    expect(newState).toEqual({
      groups: {
        '0': {
          children: [],
          rules: [],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
      },
      rules: {},
      root: '0',
      counter: 2,
    });
  });

  it('can remove group with child groups', () => {
    const state = addGroup(
      addGroup(initialState('product'), 'product', '0'),
      'product',
      '1'
    );

    const newState = removeGroup(state, '1');

    expect(newState).toEqual({
      groups: {
        '0': {
          children: [],
          rules: [],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
      },
      rules: {},
      root: '0',
      counter: 3,
    });
  });

  it('cannot remove root group', () => {
    const state = initialState('product');

    const newState = removeGroup(state, '0');

    expect(newState).toEqual({
      groups: {
        '0': {
          children: [],
          rules: [],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
      },
      rules: {},
      root: '0',
      counter: 1,
    });
  });

  it('can initialise rule', () => {
    const rule = ruleInitializer(schema, defaultFieldSchema, 'product', 'name');

    expect(rule).toEqual({
      name: 'name',
      operator: 'CONTAINS',
    });
  });

  it('can create keyed rule', () => {
    const rule = createKeyedRule(
      {
        group: '0',
        name: 'name',
        operator: 'CONTAINS',
      },
      1
    );

    expect(rule).toEqual({
      '1': {
        group: '0',
        name: 'name',
        operator: 'CONTAINS',
      },
    });
  });

  it('can add rule to state', () => {
    const state = initialState('product');

    const newState = addRule(state, {
      group: '0',
      name: 'name',
      operator: 'CONTAINS',
    });

    expect(newState).toEqual({
      groups: {
        '0': {
          children: [],
          rules: ['1'],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
      },
      rules: {
        '1': {
          group: '0',
          name: 'name',
          operator: 'CONTAINS',
        },
      },
      root: '0',
      counter: 2,
    });
  });

  it('can update rule', () => {
    const state = addRule(initialState('product'), {
      group: '0',
      name: 'name',
      operator: 'CONTAINS',
    });

    const newState = updateRule(state, '1', { value: 'foo' });

    expect(newState.rules[1]).toEqual({
      group: '0',
      name: 'name',
      operator: 'CONTAINS',
      value: 'foo',
    });
  });

  it('can remove rule', () => {
    const state = addRule(initialState('product'), {
      group: '0',
      name: 'name',
      operator: 'CONTAINS',
    });

    const newState = removeRule(state, '1');

    expect(newState).toEqual({
      groups: {
        '0': {
          children: [],
          rules: [],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
      },
      rules: {},
      root: '0',
      counter: 2,
    });
  });

  it('can remove remove group with deeply nested rules', () => {
    const state = addRule(
      addGroup(
        addGroup(initialState('product'), 'product', '0'),
        'product',
        '1'
      ),
      {
        group: '2',
        name: 'name',
        operator: 'CONTAINS',
      }
    );

    const newState = removeGroup(state, '1');

    expect(newState).toEqual({
      groups: {
        '0': {
          children: [],
          rules: [],
          inclusive: true,
          parent: undefined,
          resource: 'product',
        },
      },
      rules: {},
      root: '0',
      counter: 4,
    });
  });
});

describe('Query Builder', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Builder />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
