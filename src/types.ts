export enum FieldTypes {
  ID,
  STRING,
  NUMBER,
  BOOLEAN,
  DATE,
}

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

export interface Resource<R extends string> {
  fields?: {
    [x: string]: {
      name?: string;
      type: FieldTypes;
    };
  };
  relations?: {
    [x: string]: R;
  };
}

export type Schema<R extends string> = { [key in R]: Resource<R> };

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
  operator: Operators;
  value?: any;
}

export type Groups<R extends string> = { [x: string]: Group<R> };

export type Rules = { [x: string]: Rule };

export interface State<R extends string> {
  groups: Groups<R>;
  rules: Rules;
  root: string;
}

export interface FieldProps {
  value?: any;
  setValue: (value?: any) => void;
  operator: Operators;
  setOperator: (operator: Operators) => void;
  operators: Operators[];
}

export type SubGroupOptions<R extends string> = { [x in R]: string };

export type FieldSchema = {
  [x in FieldTypes]: {
    operators: Operators[];
    render: React.SFC<FieldProps>;
    defaultValue?: () => any;
  };
};

export interface FilterObject {
  operator: Operators;
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
  AddGroupDropdown: React.ElementType<{
    options: Record<string, string>;
    addGroup: (resource: string) => void;
  }>;
  InclusivityDropdown: React.ElementType<{
    inclusive: boolean;
    setInclusivity: (inclusivity: boolean) => void;
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
