import * as React from 'react';
import { Group as GroupComponent } from './Group';
import { Schema, State, FieldSchema } from './types';
import { initialState } from './utils';

export interface Props<R extends string> {
  onChange?: () => void;
  onFilter: (state: State<R>) => void;
  resource: R;
  schema: Schema<R>;
  fieldSchema: FieldSchema;
}

export const Builder = <R extends string>({
  onFilter,
  resource,
  schema,
  fieldSchema,
}: Props<R>) => {
  const [state, setState] = React.useState<State<R>>(initialState(resource));

  React.useEffect(() => onFilter(state), []);

  const handleFilter = () => {
    onFilter(state);
  };

  return (
    <div>
      <GroupComponent
        key={state.root}
        {...state.groups[state.root]}
        group={state.root}
        state={state}
        setState={setState}
        schema={schema}
        fieldSchema={fieldSchema}
      />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};
