import * as React from 'react';
import {
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';

interface Props {
  open: boolean;
  handleClose: () => void;
  resources: { key: string; value: string }[];
  handleResourceSelect: (resource: string) => void;
}

export const ResourceDialog: React.SFC<Props> = ({
  open,
  handleClose,
  resources,
  handleResourceSelect,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="resource-dialog-title"
    >
      <Box minWidth="320px">
        <DialogTitle id="resource-dialog-title">Resource</DialogTitle>
        <List>
          {resources.map(({ key, value }) => (
            <ListItem
              button
              onClick={() => handleResourceSelect(key)}
              key={key}
            >
              <ListItemAvatar>
                <Avatar>{value.substr(0, 1).toLocaleUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={value} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Dialog>
  );
};
