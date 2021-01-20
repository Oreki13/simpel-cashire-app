import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  CircularProgress,
  IconButton,
  TablePagination,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import firebase from "../config/firebase";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function TableItems({
  colData,
  rowData,
  page,
  totalPage,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  isLoading,
  setTotalPage,
}) {
  const classes = useStyles();
  const handelDelete = async (id) => {
    await firebase.firestore().collection("items").doc(id).delete();
    await firebase
      .firestore()
      .collection("items")
      .get()
      .then((res) => {
        setTotalPage(res.docs.length);
      })
      .catch((e) => console.log(e));
  };
  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {rowData.map((data, index) => (
                <StyledTableCell align="center" key={index}>
                  {data}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <StyledTableRow>
                <StyledTableCell colSpan="3" align="center">
                  <CircularProgress style={{ color: "white" }} />
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              colData.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {"Rp " + parseInt(row.price).toLocaleString("id-ID")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton onClick={() => handelDelete(row.id)}>
                      <DeleteIcon style={{ color: "red" }} />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
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
