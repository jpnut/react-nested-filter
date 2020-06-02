import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Box,
  Button,
  IconButton,
  Paper,
  NativeSelect,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
  Builder,
  DefaultFieldDefinitions,
  Props,
  NumberFieldProps,
} from '../../';
import { ResourceDialog } from './ResourceDialog';
import {
  BooleanField,
  DateField,
  IDField,
  NumberField,
  RangeField,
  StringField,
} from './fields';

const useRulesContainerStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    '& .group': {
      padding: '1rem',
      borderLeft: '1px solid #f1f1f1',
    },
  },
});

type CustomTypes = {
  range: NumberFieldProps;
};

type CustomFieldDefinitions = DefaultFieldDefinitions & CustomTypes;

const App = (
  props?: Partial<Props<'product' | 'tax', CustomFieldDefinitions>>
) => {
  return (
    <div>
      <Builder
        onFilter={() => undefined}
        resource="product"
        schema={{
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
                type: 'range',
                fieldProps: {
                  step: 1,
                },
              },
              available: {
                type: 'boolean',
              },
              created_at: {
                type: 'date',
              },
            },
            relations: {
              tax: 'tax',
            },
          },
          tax: {
            fields: {
              id: {
                type: 'id',
              },
              name: {
                type: 'string',
              },
              rate: {
                type: 'number',
                fieldProps: {
                  step: 1,
                },
              },
            },
          },
        }}
        components={() => ({
          Container: ({ children }) => (
            <Paper>
              <Box p={2}>{children}</Box>
            </Paper>
          ),
          FilterButton: ({ children, filter }) => (
            <Button onClick={filter}>{children}</Button>
          ),
          GroupContainer: ({ children }) => (
            <Box className="group">{children}</Box>
          ),
          GroupHeader: ({ children }) => (
            <Box display="flex" justifyContent="space-between" mb={2}>
              {children}
            </Box>
          ),
          GroupTitle: ({ children }) => (
            <Typography variant="h6" component="h3">
              {children}
            </Typography>
          ),
          GroupRemoveButton: ({ removeGroup }) => (
            <IconButton onClick={removeGroup} color="primary" size="small">
              <CloseIcon />
            </IconButton>
          ),
          GroupOptionsContainer: ({ children }) => (
            <Box mb={1.5}>{children}</Box>
          ),
          InclusivityDropdown: ({ inclusive, setInclusivity }) => {
            const handleSetInclusivity = ({
              target: { value },
            }: React.ChangeEvent<HTMLSelectElement>) => {
              setInclusivity(value === 'and');
            };

            return (
              <NativeSelect
                value={inclusive ? 'and' : 'or'}
                onChange={handleSetInclusivity}
              >
                <option value="and">And</option>
                <option value="or">Or</option>
              </NativeSelect>
            );
          },
          AddGroupDropdown: ({ addGroup, options }) => {
            const [open, setOpen] = React.useState(false);

            const handleOpen = () => setOpen(true);

            const handleClose = () => setOpen(false);

            const resources = React.useMemo(
              () =>
                Object.keys(options).map(option => ({
                  key: option,
                  value: options[option],
                })),
              [options]
            );

            const handleResourceSelect = (resource: string) => {
              addGroup(resource);
              handleClose();
            };

            return (
              <>
                <Button color="primary" onClick={handleOpen}>
                  Add Group
                </Button>
                <ResourceDialog
                  open={open}
                  handleClose={handleClose}
                  resources={resources}
                  handleResourceSelect={handleResourceSelect}
                />
              </>
            );
          },
          AddRuleButton: ({ addRule }) => (
            <Button color="primary" onClick={addRule}>
              Add Rule
            </Button>
          ),
          GroupRulesContainer: ({ children }) => {
            const classes = useRulesContainerStyles();
            return <Box className={classes.root}>{children}</Box>;
          },
          RuleContainer: ({ children }) => (
            <Box
              borderRadius="3px"
              display="flex"
              flexDirection="row"
              p={1}
              bgcolor="#f1f1f1"
              mb={1}
            >
              {children}
            </Box>
          ),
          RuleSelect: ({ resource, field, setRuleField, options }) => {
            const handleChangeField = ({
              target: { value },
            }: React.ChangeEvent<HTMLSelectElement>) => {
              setRuleField(value);
            };

            return (
              <Box mr={2}>
                <NativeSelect value={field} onChange={handleChangeField}>
                  {options.map(({ key, value }) => (
                    <option key={`${resource}-${key}`} value={key}>
                      {value}
                    </option>
                  ))}
                </NativeSelect>
              </Box>
            );
          },
          RuleField: ({ children }) => (
            <Box display="flex" flex={1}>
              {children}
            </Box>
          ),
          RuleRemoveButton: ({ removeRule }) => (
            <Box display="flex" ml={2}>
              <IconButton onClick={removeRule} color="primary" size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          ),
        })}
        fieldSchema={defaultFieldSchema => ({
          ...defaultFieldSchema,
          id: {
            ...defaultFieldSchema.id,
            render: IDField,
          },
          string: {
            ...defaultFieldSchema.string,
            render: StringField,
          },
          number: {
            ...defaultFieldSchema.number,
            render: NumberField,
          },
          date: {
            ...defaultFieldSchema.date,
            render: DateField,
          },
          boolean: {
            ...defaultFieldSchema.boolean,
            render: BooleanField,
          },
          range: {
            ...defaultFieldSchema.number,
            render: RangeField,
          },
        })}
        {...props}
      />
    </div>
  );
};

ReactDOM.render(
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <App />
  </MuiPickersUtilsProvider>,
  document.getElementById('root')
);
