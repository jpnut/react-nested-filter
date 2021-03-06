import { defaultFieldSchema } from './fields';
import {
  Components,
  FieldSchema,
  FieldTypeDefinition,
  DefaultFieldDefinitions,
} from './types';
import { defaultComponents } from './components';

export interface FilterState<F extends FieldTypeDefinition> {
  components: Components;
  fieldSchema: FieldSchema<F>;
}

interface ConfigurableFilterState<F extends FieldTypeDefinition> {
  components?: (defaultComponents: Components) => Components;
  fieldSchema?: (
    defaultFieldSchema: FieldSchema<DefaultFieldDefinitions>
  ) => FieldSchema<F>;
}

export const useFilter = <F extends FieldTypeDefinition>({
  components,
  fieldSchema,
}: ConfigurableFilterState<F>): FilterState<F> => {
  return {
    components:
      (components && components(defaultComponents)) || defaultComponents,
    fieldSchema:
      (fieldSchema && fieldSchema(defaultFieldSchema)) ||
      ((defaultFieldSchema as unknown) as FieldSchema<F>),
  };
};
