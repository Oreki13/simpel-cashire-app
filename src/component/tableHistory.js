import {
  CircularProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from "@material-ui/core";
import React from "react";
import RowColapse from "./rowColapse";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

export default function TableComponentHistory({
  rowData,
  colData,
  totalPage,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  isLoading,
}) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {rowData.map((row, index) => (
                <StyledTableCell key={index} align="center">
                  {row}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="5" align="center">
                  {" "}
                  <CircularProgress style={{ color: "white" }} />{" "}
                </TableCell>
              </TableRow>
            ) : (
              colData.map((col, index) => {
                return <RowColapse key={index} row={col} />;
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
        component="div"
        count={totalPage}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
