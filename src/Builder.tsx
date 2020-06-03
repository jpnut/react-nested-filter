import * as React from 'react';
import { Record } from 'immutable';
import { Group as GroupComponent } from './Group';
import {
  Schema,
  FieldSchema,
  Components,
  FieldTypeDefinition,
  DefaultFieldDefinitions,
} from './types';
import { nullOperator } from './utils';
import { useFilter } from './use-filter';
import { State, initialState } from './immutable-utils';

interface BaseProps<R extends string, F extends FieldTypeDefinition> {
  onChange?: (state: Record<State>) => void;
  onFilter: (state: Record<State>) => void;
  resource: R;
  schema: Schema<R, F>;
  components?: (defaultComponents: Components) => Components;
  fieldSchema?: (
    defaultFieldSchema: FieldSchema<DefaultFieldDefinitions>
  ) => FieldSchema<F>;
  isNullOperator?: (operator: string) => boolean;
}

type ControlledProps<
  R extends string,
  F extends FieldTypeDefinition
> = BaseProps<R, F> & {
  state: Record<State>;
  setState: React.Dispatch<React.SetStateAction<Record<State>>>;
};

export type Props<R extends string, F extends FieldTypeDefinition> =
  | BaseProps<R, F>
  | ControlledProps<R, F>;

interface BuilderState {
  state: Record<State>;
}

const initialStateFromProps = <R extends string, F extends FieldTypeDefinition>(
  props: Props<R, F>
) => {
  const state = 'state' in props ? props.state : initialState(props.resource);

  return {
    state,
  };
};
export class Builder<
  R extends string,
  F extends FieldTypeDefinition
> extends React.Component<Props<R, F>, BuilderState> {
  public components: Components;

  public fieldSchema: FieldSchema<F>;

  public static getDerivedStateFromProps(props: any) {
    return 'state' in props
      ? {
          state: props.state,
        }
      : null;
  }

  constructor(props: Props<R, F>) {
    super(props);

    const { components, fieldSchema } = useFilter({
      components: props.components,
      fieldSchema: props.fieldSchema,
    });

    this.components = components;
    this.fieldSchema = fieldSchema;

    this.state = {
      ...initialStateFromProps(props),
      ...useFilter({
        components: props.components,
        fieldSchema: props.fieldSchema,
      }),
    };
  }

  public componentDidUpdate(
    { components, fieldSchema }: Props<R, F>,
    { state: prevState }: BuilderState
  ) {
    if (prevState !== this.state.state) {
      this.onChange();
    }

    if (
      components !== this.props.components ||
      fieldSchema !== this.props.fieldSchema
    ) {
      const { components, fieldSchema } = useFilter({
        components: this.props.components,
        fieldSchema: this.props.fieldSchema,
      });

      this.components = components;
      this.fieldSchema = fieldSchema;
    }
  }

  public setQueryState = (state: Record<State>) => {
    this.setState({
      state,
    });
  };

  public updateState = (callback: (state: Record<State>) => Record<State>) => {
    const setState =
      'setState' in this.props ? this.props.setState : this.setQueryState;

    setState(callback(this.state.state));
  };

  public onChange = () => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(this.state.state);
    }
  };

  public handleFilter = () => {
    this.props.onFilter(this.state.state);
  };

  public render() {
    const {
      components,
      fieldSchema,
      props: { schema, isNullOperator = nullOperator },
      state: { state },
    } = this;

    const group = state.get('tree');

    return (
      <components.Container>
        <GroupComponent
          key={group.get('id')}
          group={group}
          setState={this.updateState}
          schema={schema}
          components={components}
          fieldSchema={fieldSchema}
          isNullOperator={isNullOperator}
        />
        <components.FilterButton filter={this.handleFilter}>
          Filter
        </components.FilterButton>
      </components.Container>
    );
  }
}
