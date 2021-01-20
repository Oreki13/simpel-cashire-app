import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useState } from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});
export default function RowColapse({ row }) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  return (
    <Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.date}
        </TableCell>
        <TableCell align="center">
          {row.payment.cash ? "Cash" : "Credit"}
        </TableCell>
        <TableCell align="center">{row.data.length}</TableCell>
        <TableCell align="center">
          {"Rp " + row.shopPrice.toLocaleString("id-ID")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Detail
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name Item</TableCell>
                    <TableCell align="center">Harga</TableCell>
                    <TableCell align="center">Jumlah</TableCell>
                    <TableCell align="center">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.data.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell align="center" component="th" scope="row">
                        {detail.name}
                      </TableCell>
                      <TableCell align="center">
                        {"Rp " + detail.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell align="center">{detail.qty}</TableCell>
                      <TableCell align="center">
                        {"Rp " + detail.total.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
