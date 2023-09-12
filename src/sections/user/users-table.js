import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { Modal } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const UsersTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleModalToggle = (user) => {
    setSelectedUser(user);
    setOpen(!open);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectAll?.();
                        } else {
                          onDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    ID
                  </TableCell>
                  <TableCell>
                    이메일
                  </TableCell>
                  <TableCell>
                    닉네임
                  </TableCell>
                  <TableCell>
                    유저타입
                  </TableCell>
                  <TableCell>
                    생성일
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((user) => {
                  const isSelected = selected.includes(user.id);
                  const createdAt = format(new Date(user.createdAt), 'yyyy-MM-dd hh:mm:ss');

                  return (
                    <TableRow
                      hover
                      key={user.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(user.id);
                            } else {
                              onDeselectOne?.(user.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {user.id}
                      </TableCell>
                      <TableCell>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {user.nickname}
                        {/* <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Avatar src={customer.avatar}>
                            {getInitials(customer.name)}
                          </Avatar>
                          <Typography variant="subtitle2">
                            {customer.name}
                          </Typography>
                        </Stack> */}
                      </TableCell>
                      <TableCell>
                        {user.role == "ROLE_ADMIN" ? "ADMIN" : "USER"}
                      </TableCell>
                      <TableCell>
                        {createdAt}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleModalToggle(user)}
                          sx={{ marginRight: 1 }}
                        >
                          수정
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          onClick={() => handleModalToggle(user)}
                        >
                          삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 30, 100]}
        />
      </Card>
      <Dialog
        open={open}
        onClose={() => handleModalToggle(null)}
      >
        <DialogTitle>
          {"User Details"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Modal Content for {selectedUser ? selectedUser.nickname : 'No User'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModalToggle(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

UsersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
