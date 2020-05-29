import * as React from 'react';
import { Group as GroupComponent } from './Group';
import {
  Schema,
  State,
  FieldSchema,
  Components,
  FieldTypeDefinition,
  DefaultFieldDefinitions,
} from './types';
import { initialState } from './utils';
import { useFilter } from './Context';

export interface Props<R extends string, F extends FieldTypeDefinition> {
  onChange?: () => void;
  onFilter: (state: State<R>) => void;
  resource: R;
  schema: Schema<R, F>;
  components?: (defaultComponents: Components) => Components;
  fieldSchema?: (
    defaultFieldSchema: FieldSchema<DefaultFieldDefinitions>
  ) => FieldSchema<F>;
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

  const { components, fieldSchema } = React.useMemo(
    () =>
      useFilter({
        components: propComponents,
        fieldSchema: propFieldSchema,
      }),
    [propComponents, propFieldSchema]
  );

  const handleFilter = () => {
    onFilter(state);
  };

  return (
    <components.Container>
      <GroupComponent
        key={state.root}
        {...state.groups[state.root]}
        group={state.root}
        state={state}
        setState={setState}
        schema={schema}
        components={components}
        fieldSchema={fieldSchema}
      />
      <components.FilterButton filter={handleFilter}>
        Filter
      </components.FilterButton>
    </components.Container>
  );
};
