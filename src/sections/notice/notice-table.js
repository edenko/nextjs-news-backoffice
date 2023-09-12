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
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  TextField
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { Modal } from '@mui/material';

export const NoticeTable = (props) => {
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
  const [selectedItem, setSelectedItem] = useState(null);
  const handleModalToggle = (item) => {
    setSelectedItem(item);
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
                    제목
                  </TableCell>
                  <TableCell>
                    내용
                  </TableCell>
                  <TableCell>
                    생성일
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const isSelected = selected.includes(item.id);
                  const createdAt = format(new Date(item.createdAt), 'yyyy-MM-dd hh:mm:ss');

                  return (
                    <TableRow
                      hover
                      key={item.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(item.id);
                            } else {
                              onDeselectOne?.(item.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {item.id}
                      </TableCell>
                      <TableCell>
                        {item.title}
                      </TableCell>
                      <TableCell>
                        {item.content}
                      </TableCell>
                      <TableCell>
                        {createdAt}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleModalToggle(item)}
                          sx={{ marginRight: 1 }}
                        >
                          수정
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          onClick={() => handleModalToggle(item)}
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
        maxWidth="md"
        // fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
          <Typography variant="h5" color="primary">
            Notice Detail
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ padding: '16px', width: '600px' }}>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}> */}
              <Typography variant="subtitle1" color="textSecondary">
                Writer: <span style={{ color: 'black' }}>{selectedItem ? selectedItem.writerName : 'No Writer'}</span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant="subtitle1" color="textSecondary">
                  Created At: <span style={{ color: 'black' }}>{selectedItem ? format(new Date(selectedItem.createdAt), 'yyyy-MM-dd hh:mm:ss') : 'No Date'}</span>
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Updated At: <span style={{ color: 'black' }}>{selectedItem ? (selectedItem.updatedAt != null ? format(new Date(selectedItem.updatedAt), 'yyyy-MM-dd hh:mm:ss') : '-') : 'No Date'}</span>
                </Typography>
              </Box>
            <Typography variant="subtitle1" color="textSecondary" mt={2}>
              Title
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              defaultValue={selectedItem ? selectedItem.title : 'No Title'}
            />
            <Typography variant="subtitle1" color="textSecondary" mt={2}>
              Content
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={10}
              defaultValue={selectedItem ? selectedItem.content : 'No Content'}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => handleModalToggle(null)}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
          <Button
            onClick={() => handleModalToggle(null)}
            color="secondary"
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

NoticeTable.propTypes = {
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
