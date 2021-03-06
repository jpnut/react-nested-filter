import { Record as IRecord } from 'immutable';

export interface NumberFieldProps {
  step?: number;
  min?: number;
  max?: number;
}

export type DefaultFieldDefinitions = {
  id: never;
  string: never;
  number: NumberFieldProps;
  boolean: never;
  date: never;
};

export enum Operators {
  IS = 'IS',
  IS_NOT = 'IS_NOT',
  LIKE = 'LIKE',
  NOT_LIKE = 'NOT_LIKE',
  CONTAINS = 'CONTAINS',
  DOES_NOT_CONTAIN = 'DOES_NOT_CONTAIN',
  BEGINS = 'BEGINS',
  DOES_NOT_BEGIN = 'DOES_NOT_BEGIN',
  ENDS = 'ENDS',
  DOES_NOT_END = 'DOES_NOT_END',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL_TO = 'LESS_THAN_OR_EQUAL_TO',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL_TO = 'GREATER_THAN_OR_EQUAL_TO',
  NULL = 'NULL',
  NOT_NULL = 'NOT_NULL',
}

export type FieldTypeDefinition = {
  [key: string]: never | Record<string, any>;
};

type BaseFieldDefinition = {
  operators: string[];
  defaultValue?: () => any;
};

export type FieldSchema<T extends FieldTypeDefinition> = {
  [K in keyof T]: BaseFieldDefinition &
    (T[K] extends never
      ? {
          render: React.SFC<FieldProps>;
        }
      : {
          render: React.SFC<FieldProps & T[K]>;
        });
};

type BaseFieldType<T> = {
  type: T;
};

export type FieldTypeMap<T extends FieldTypeDefinition> = {
  [K in keyof T]: BaseFieldType<K> &
    (T[K] extends never ? { fieldProps?: never } : { fieldProps: T[K] });
};

export type FieldTypesUnion<T extends FieldTypeDefinition> = FieldTypeMap<
  T
>[keyof FieldTypeMap<T>];

export type FieldType<F extends FieldTypeDefinition> = {
  name?: string;
} & FieldTypesUnion<F>;

export interface Resource<R extends string, F extends FieldTypeDefinition> {
  fields?: {
    [x: string]: FieldType<F>;
  };
  relations?: {
    [x: string]: R;
  };
}

export type Schema<R extends string, F extends FieldTypeDefinition> = {
  [key in R]: Resource<R, F>;
};

export interface Group<R extends string> {
  children: string[];
  rules: string[];
  inclusive: boolean;
  parent?: string;
  resource: R;
}

export interface Rule {
  group: string;
  name: string;
  operator: string;
  value?: any;
}

export type Groups<R extends string> = { [x: string]: Group<R> };

export type Rules = { [x: string]: Rule };

export interface State {
  counter: number;
  tree: Branch;
}

export interface StateRecord {
  counter: number;
  tree: IRecord<BranchRecord>;
}

export interface Branch {
  id: string;
  inclusive: boolean;
  resource: string;
  rules: Record<string, Leaf>;
  groups: Record<string, Branch>;
  path: string[];
}

export interface BranchRecord {
  id: string;
  inclusive: boolean;
  resource: string;
  rules: Record<string, IRecord<Leaf>>;
  groups: Record<string, IRecord<BranchRecord>>;
  path: string[];
}

export interface Leaf extends Omit<Rule, 'group'> {
  id: string;
  path: string[];
}

export interface FieldProps {
  value?: any;
  setValue: (value?: any) => void;
  operator: string;
  setOperator: (operator: string) => void;
  operators: string[];
}

export type SubGroupOptions<R extends string> = { [x in R]: string };

export interface FilterObject {
  operator: string;
  value?: any;
}

export type FilterValue = Filter[] | FilterObject[] | FilterObject;

export interface Filter {
  and?: Filter[] | null;
  or?: Filter[] | null;
  [x: string]: FilterValue | null | undefined;
}

export interface Components {
  Container: React.ElementType;
  FilterButton: React.ElementType<{
    filter: () => void;
  }>;
  GroupContainer: React.ElementType;
  GroupHeader: React.ElementType;
  GroupTitle: React.ElementType;
  GroupRemoveButton: React.ElementType<{
    removeGroup: () => void;
  }>;
  GroupOptionsContainer: React.ElementType;
  InclusivityDropdown: React.ElementType<{
    inclusive: boolean;
    setInclusivity: (inclusivity: boolean) => void;
  }>;
  AddGroupDropdown: React.ElementType<{
    options: Record<string, string>;
    addGroup: (resource: string) => void;
  }>;
  AddRuleButton: React.ElementType<{
    addRule: () => void;
  }>;
  GroupRulesContainer: React.ElementType;
  RuleContainer: React.ElementType;
  RuleSelect: React.ElementType<{
    resource: string;
    field: string;
    setRuleField: (field: string) => void;
    options: { key: string; value: string }[];
  }>;
  RuleField: React.ElementType;
  RuleRemoveButton: React.ElementType<{
    removeRule: () => void;
  }>;
}
