import * as React from 'react';
import { Group as GroupComponent } from './Group';
import {
  Schema,
  State,
  FieldSchema,
  Components,
  FieldTypeDefinition,
} from './types';
import { initialState } from './utils';
import { useFilter, createFilterContext } from './Context';

export interface Props<R extends string, F extends FieldTypeDefinition> {
  onChange?: () => void;
  onFilter: (state: State<R>) => void;
  resource: R;
  schema: Schema<R, F>;
  components?: (defaultComponents: Components) => Components;
  fieldSchema?: FieldSchema<F>;
}

export const Builder = <R extends string, F extends FieldTypeDefinition>({
  resource,
  components: propComponents,
  fieldSchema: propFieldSchema,
  onFilter,
  schema,
}: Props<R, F>) => {
  const memoizedState = React.useMemo(() => initialState(resource), []);

  const [state, setState] = React.useState<State<R>>(memoizedState);

  const { FilterContext, useFilterContext } = React.useMemo(
    () => createFilterContext<F>(),
    []
  );

  const context = useFilter({
    components: propComponents,
    fieldSchema: propFieldSchema,
  });

  const handleFilter = () => {
    onFilter(state);
  };

  return (
    <FilterContext.Provider value={context}>
      <context.components.Container>
        <GroupComponent
          key={state.root}
          {...state.groups[state.root]}
          group={state.root}
          state={state}
          setState={setState}
          schema={schema}
          useFilterContext={useFilterContext}
        />
        <context.components.FilterButton filter={handleFilter}>
          Filter
        </context.components.FilterButton>
      </context.components.Container>
    </FilterContext.Provider>
  );
};
