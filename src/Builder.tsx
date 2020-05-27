import * as React from 'react';
import { useComponents, ComponentContext } from './components';
import { Group as GroupComponent } from './Group';
import { Schema, State, FieldSchema, Components } from './types';
import { initialState } from './utils';

export interface Props<R extends string> {
  onChange?: () => void;
  onFilter: (state: State<R>) => void;
  resource: R;
  schema: Schema<R>;
  fieldSchema: FieldSchema;
  components?: Partial<Components>;
}

export const Builder = <R extends string>({
  onFilter,
  resource,
  schema,
  fieldSchema,
  components: propComponents,
}: Props<R>) => {
  const [state, setState] = React.useState<State<R>>(initialState(resource));

  const components = useComponents(propComponents);

  React.useEffect(() => onFilter(state), []);

  const handleFilter = () => {
    onFilter(state);
  };

  return (
    <ComponentContext.Provider value={components}>
      <components.Container>
        <GroupComponent
          key={state.root}
          {...state.groups[state.root]}
          group={state.root}
          state={state}
          setState={setState}
          schema={schema}
          fieldSchema={fieldSchema}
        />
        <components.FilterButton filter={handleFilter}>
          Filter
        </components.FilterButton>
      </components.Container>
    </ComponentContext.Provider>
  );
};
