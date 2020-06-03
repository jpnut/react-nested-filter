import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Builder } from '../stories/Builder.stories';
import {
  DefaultFieldDefinitions,
  Schema,
  defaultFieldSchema,
  ruleInitializer,
} from '../src';
import {
  initialState,
  addGroup,
  updateGroup,
  removeGroup,
  addRule,
  updateRule,
  removeRule,
} from '../src/immutable-utils';

describe('Rule Initialiser', () => {
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

  it('can initialise rule', () => {
    const rule = ruleInitializer(schema, defaultFieldSchema, 'product', 'name');

    expect(rule).toEqual({
      name: 'name',
      operator: 'CONTAINS',
    });
  });
});

describe('Immutable State', () => {
  it('can initialise state', () => {
    const state = initialState('product');

    expect(state.toJS()).toEqual({
      counter: 1,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {},
        groups: {},
        path: ['tree'],
      },
    });
  });

  it('can add group to state', () => {
    const newState = addGroup(initialState('product'), 'product', ['tree']);

    expect(newState.toJS()).toEqual({
      counter: 2,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {},
        groups: {
          '1': {
            id: '1',
            inclusive: true,
            resource: 'product',
            rules: {},
            groups: {},
            path: ['tree', 'groups', '1'],
          },
        },
        path: ['tree'],
      },
    });
  });

  it('can update group', () => {
    const newState = updateGroup(initialState('product'), ['tree'], {
      inclusive: false,
    });

    expect(newState.toJS()).toEqual({
      counter: 1,
      tree: {
        id: '0',
        inclusive: false,
        resource: 'product',
        rules: {},
        groups: {},
        path: ['tree'],
      },
    });
  });

  it('can remove group', () => {
    const newState = removeGroup(
      addGroup(initialState('product'), 'product', ['tree']),
      ['tree', 'groups', '1']
    );

    expect(newState.toJS()).toEqual({
      counter: 2,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {},
        groups: {},
        path: ['tree'],
      },
    });
  });

  it('can remove group with child groups', () => {
    const state = removeGroup(
      addGroup(
        addGroup(initialState('product'), 'product', ['tree']),
        'product',
        ['tree', 'groups', '1']
      ),
      ['tree', 'groups', '1']
    );

    expect(state.toJS()).toEqual({
      counter: 3,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {},
        groups: {},
        path: ['tree'],
      },
    });
  });

  it('cannot remove root group', () => {
    const state = removeGroup(initialState('product'), ['tree']);

    expect(state.toJS()).toEqual({
      counter: 1,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {},
        groups: {},
        path: ['tree'],
      },
    });
  });

  it('can add rule to state', () => {
    const state = addRule(
      initialState('product'),
      {
        name: 'name',
        operator: 'CONTAINS',
      },
      ['tree']
    );

    expect(state.toJS()).toEqual({
      counter: 2,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {
          '1': {
            id: '1',
            name: 'name',
            operator: 'CONTAINS',
            path: ['tree', 'rules', '1'],
            value: undefined,
          },
        },
        groups: {},
        path: ['tree'],
      },
    });
  });

  it('can update rule', () => {
    const state = updateRule(
      addRule(
        initialState('product'),
        {
          name: 'name',
          operator: 'CONTAINS',
        },
        ['tree']
      ),
      ['tree', 'rules', '1'],
      { value: 'foo' }
    );

    expect(state.toJS().tree.rules[1]).toEqual({
      id: '1',
      name: 'name',
      operator: 'CONTAINS',
      value: 'foo',
      path: ['tree', 'rules', '1'],
    });
  });

  it('can remove rule', () => {
    const state = removeRule(
      addRule(
        initialState('product'),
        {
          name: 'name',
          operator: 'CONTAINS',
        },
        ['tree']
      ),
      ['tree', 'rules', '1']
    );

    expect(state.toJS().tree.rules).toEqual({});
  });

  it('can add rule to deeply nested group', () => {
    const state = addRule(
      addGroup(
        addGroup(initialState('product'), 'product', ['tree']),
        'product',
        ['tree', 'groups', '1']
      ),
      {
        name: 'name',
        operator: 'CONTAINS',
      },
      ['tree', 'groups', '1', 'groups', '2']
    );

    expect(state.toJS()).toEqual({
      counter: 4,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {},
        groups: {
          '1': {
            id: '1',
            inclusive: true,
            resource: 'product',
            rules: {},
            groups: {
              '2': {
                id: '2',
                inclusive: true,
                resource: 'product',
                rules: {
                  '3': {
                    id: '3',
                    name: 'name',
                    operator: 'CONTAINS',
                    value: undefined,
                    path: ['tree', 'groups', '1', 'groups', '2', 'rules', '3'],
                  },
                },
                groups: {},
                path: ['tree', 'groups', '1', 'groups', '2'],
              },
            },
            path: ['tree', 'groups', '1'],
          },
        },
        path: ['tree'],
      },
    });
  });

  it('can remove remove group with deeply nested rules', () => {
    const state = removeGroup(
      addRule(
        addGroup(
          addGroup(initialState('product'), 'product', ['tree']),
          'product',
          ['tree', 'groups', '1']
        ),
        {
          name: 'name',
          operator: 'CONTAINS',
        },
        ['tree', 'groups', '1', 'groups', '2']
      ),
      ['tree', 'groups', '1']
    );

    expect(state.toJS()).toEqual({
      counter: 4,
      tree: {
        id: '0',
        inclusive: true,
        resource: 'product',
        rules: {},
        groups: {},
        path: ['tree'],
      },
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
