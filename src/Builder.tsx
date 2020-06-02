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
import { initialState, nullOperator } from './utils';
import { useFilter } from './use-filter';

interface BaseProps<R extends string, F extends FieldTypeDefinition> {
  onChange?: (state: State<R>) => void;
  onFilter: (state: State<R>) => void;
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
  state: State<R>;
  setState: React.Dispatch<React.SetStateAction<State<R>>>;
};

export type Props<R extends string, F extends FieldTypeDefinition> =
  | BaseProps<R, F>
  | ControlledProps<R, F>;

interface BuilderState<R extends string> {
  state: State<R>;
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
> extends React.Component<Props<R, F>, BuilderState<R>> {
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
    { state: prevState }: BuilderState<R>
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

  public setQueryState = (state: State<R>) => {
    this.setState({
      state,
    });
  };

  public updateState = (callback: (state: State<R>) => State<R>) => {
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

  public getGroup = (key: string) => this.state.state.groups[key];

  public getRule = (key: string) => this.state.state.rules[key];

  public render() {
    const {
      components,
      fieldSchema,
      props: { schema, isNullOperator = nullOperator },
      state: { state },
    } = this;

    return (
      <components.Container>
        <GroupComponent
          key={state.root}
          {...state.groups[state.root]}
          group={state.root}
          setState={this.updateState}
          schema={schema}
          components={components}
          fieldSchema={fieldSchema}
          isNullOperator={isNullOperator}
          getGroup={this.getGroup}
          getRule={this.getRule}
        />
        <components.FilterButton filter={this.handleFilter}>
          Filter
        </components.FilterButton>
      </components.Container>
    );
  }
}
