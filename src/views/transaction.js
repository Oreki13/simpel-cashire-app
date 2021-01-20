import { Container, Grid, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import BoxOrder from "../component/boxOrder";
import TableComponentTransaction from "../component/tableTransaction";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  container: {
    padding: 20,
  },
});

export default function Transaction() {
  const classes = useStyles();
  const [colDatas, setColDatas] = useState([]);
  const [totalPay, setTotalPay] = useState(0);
  const [total, setTotal] = useState(0);
  const [nameItem, setNameItem] = useState("");
  const [price, setPrice] = useState(undefined);
  const [qty, setQty] = useState(1);
  const row = ["Nama Item", "Harga", "Jumlah", "Total:w=150", ""];
  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TableComponentTransaction
            totalPay={totalPay}
            setTotalPay={setTotalPay}
            setColData={setColDatas}
            rowData={row}
            colData={colDatas}
            total={total}
            setTotal={setTotal}
            nameItem={nameItem}
            setNameItem={setNameItem}
            price={price}
            setPrice={setPrice}
            qty={qty}
            setQty={setQty}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <BoxOrder
            setTotal={setTotal}
            setNameItem={setNameItem}
            setPrice={setPrice}
            setQty={setQty}
            setTotalPay={setTotalPay}
            colData={colDatas}
            setColData={setColDatas}
            totalPay={totalPay}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
