import {
  Box,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import DialogShop from "./dialogShop";

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

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
}));

const MyTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: blue[300],
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: blue[300],
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: blue[300],
      },
    },
    "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
  },
})(TextField);

export default function TableComponentTransaction({
  rowData,
  colData,
  totalPay,
  setTotalPay,
  setColData,
  total,
  setTotal,
  nameItem,
  setNameItem,
  price,
  setPrice,
  qty,
  setQty,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const onAdd = () => {
    let tmp = JSON.parse(JSON.stringify(colData));
    // const nameItem = nameItemRef.current.value;
    const data = {
      id: uuidv4(),
      name: nameItem,
      price: price,
      qty: qty,
      total: total,
    };
    setTotalPay(totalPay + total);
    tmp.push(data);

    setColData(tmp);
    setNameItem("");
    setPrice("");
    setQty(1);
    setTotal(0);
  };

  const onChangePrice = (e) => {
    const priceVal = e.target.value;
    setPrice(parseInt(priceVal));
    if (priceVal.length > 0) {
      setTotal(parseInt(priceVal) * qty);
    } else {
      setTotal(0);
    }
  };

  const handelQty = (status) => {
    if (price > 0) {
      if (status.toLowerCase() === "add") {
        const valAdd = qty + 1;
        const addTotal = parseInt(price) * parseInt(valAdd);
        setQty(valAdd);
        setTotal(parseInt(addTotal));
      } else if (status.toLowerCase() === "min") {
        const valMin = qty - 1;
        const minTotal = total - price;
        setQty(valMin);
        setTotal(parseInt(minTotal));
      }
    }
  };

  const handelDelete = (id, itemPrice) => {
    const filter = colData.filter((data) => data.id !== id);
    const minPay = totalPay - itemPrice;
    setColData(filter);
    setTotalPay(minPay);
  };

  const handleClickOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handelChangeQty = (qty, id, price, status) => {
    if (status === "add") {
      const change = colData.map((data) => {
        if (data.id === id) {
          const add = data.qty + 1;
          const total = data.price * add;
          setTotalPay(totalPay + data.price);
          return {
            ...data,
            qty: add,
            total: total,
          };
        }
        return data;
      });
      setColData(change);
    } else if (status === "min") {
      const change = colData.map((data) => {
        if (data.id === id) {
          const add = data.qty - 1;
          const total = data.total - data.price;
          setTotalPay(totalPay - data.price);

          return {
            ...data,
            qty: add,
            total: total,
          };
        }
        return data;
      });
      setColData(change);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {rowData.map((row, index) => {
              const split1 = row.split(":");
              const split2 = split1.length > 1 ? split1[1].split("=") : null;
              return (
                <StyledTableCell
                  key={index}
                  width={
                    split2 != null && split2.length > 1 && split2[0] === "w"
                      ? split2[1]
                      : undefined
                  }
                  align="center"
                >
                  {split1[0]}
                </StyledTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {colData.map((col, index) => {
            return (
              <StyledTableRow key={index}>
                <StyledTableCell align="center">{col.name}</StyledTableCell>
                <StyledTableCell align="center">
                  {col.price.toLocaleString("id-ID")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <IconButton
                      disabled={col.qty > 1 ? false : true}
                      onClick={() =>
                        handelChangeQty(col.qty, col.id, col.price, "min")
                      }
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                    <Typography variant="body1">{col.qty}</Typography>
                    <IconButton
                      onClick={() =>
                        handelChangeQty(col.qty, col.id, col.price, "add")
                      }
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Box>
                </StyledTableCell>
                <StyledTableCell colSpan align="center">
                  {col.total.toLocaleString("id-ID")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton onClick={() => handelDelete(col.id, col.total)}>
                    <DeleteIcon style={{ color: "red" }} />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">
              <MyTextField
                value={nameItem}
                onChange={(e) => setNameItem(e.target.value)}
                variant="outlined"
                label="Nama Barang"
              />
            </StyledTableCell>
            <StyledTableCell align="center">
              <MyTextField
                type="number"
                value={price}
                variant="outlined"
                label="Harga"
                onChange={(v) => onChangePrice(v)}
              />
            </StyledTableCell>
            <StyledTableCell align="right">
              <Box display="flex" justifyContent="center" alignItems="center">
                <IconButton
                  disabled={price > 0 && qty > 1 ? false : true}
                  onClick={() => handelQty("min")}
                >
                  <RemoveCircleIcon />
                </IconButton>
                <Typography variant="body1">{qty}</Typography>
                <IconButton
                  disabled={price > 0 ? false : true}
                  onClick={() => handelQty("add")}
                >
                  <AddCircleIcon />
                </IconButton>
              </Box>
            </StyledTableCell>
            <StyledTableCell align="center">
              <p>Rp {total.toLocaleString("id-ID")}</p>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Box display="flex">
                <IconButton
                  disabled={nameItem.length > 0 && price > 0 ? false : true}
                  onClick={() => onAdd()}
                >
                  <AddBoxIcon style={{ color: blue[600] }} />
                </IconButton>
                <IconButton onClick={() => handleClickOpenModal()}>
                  <AddShoppingCartIcon style={{ color: blue[600] }} />
                </IconButton>
              </Box>
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
      <DialogShop
        open={open}
        handleClickOpen={handleClickOpenModal}
        handleClose={handleCloseModal}
        colDataTrans={colData}
        setColDataTrans={setColData}
        setTotalPay={setTotalPay}
        totalPay={totalPay}
      />
    </TableContainer>
  );
}
