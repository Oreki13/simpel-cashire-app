import {
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import React, { useEffect, useState } from "react";
import firebase from "../config/firebase";
import DialogComponent from "./dialog";

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

export default function BoxOrder({
  totalPay,
  colData,
  setNameItem,
  setPrice,
  setQty,
  setTotal,
  setTotalPay,
  setColData,
}) {
  const [cash, setCash] = useState();
  const [credit, setCredit] = useState();
  const [paying, setPaying] = useState(0);
  const [changes, setChanges] = useState(0);
  const [btnPay, setBtnPay] = useState(true);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChanges = (val) => {
    const min = val - totalPay;
    if (colData.length > 0) {
      if (val >= totalPay) {
        setChanges(min);
        setBtnPay(false);
      } else {
        setChanges(0);
        setBtnPay(true);
      }
    } else {
      setChanges(0);
      setBtnPay(true);
    }
  };

  const handelChangePay = (name, val) => {
    if (name === "cash") {
      setCash(parseInt(val));
      setPaying(parseInt(val));
      onChanges(val);
    } else if (name === "credit") {
      setCredit(parseInt(val));
      setPaying(parseInt(val));
      onChanges(val);
    }
  };

  useEffect(() => {
    if (cash > 0) {
      onChanges(cash);
    } else if (credit > 0) {
      onChanges(credit);
    }
  }, [totalPay]);

  const handelPay = () => {
    setIsLoading(true);
    const data = {
      date: firebase.firestore.Timestamp.now(),
      data: colData,
      payment: {
        cash: cash > 0 ? true : false,
        credit: credit > 0 ? true : false,
        pay: paying,
        changes: changes,
      },
      shopPrice: totalPay,
    };

    firebase
      .firestore()
      .collection("cashire")
      .add(data)
      .then((v) => {
        setNameItem("");
        setPrice("");
        setQty(1);
        setTotal(0);
        setPaying(0);
        setBtnPay(true);
        setCash("");
        setCredit("");
        setColData([]);
        setTotalPay(0);
        setChanges(0);
        setOpen(true);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <Paper style={{ padding: 15 }}>
      <DialogComponent
        open={open}
        close={() => setOpen(false)}
        title="Informasi"
        message="Data Berhasil di Input"
        action={<Button onClick={() => setOpen(false)}>Close</Button>}
      />
      <Box display="flex" flexDirection="column" width="100%">
        <Box
          marginY={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Total</Typography>

          <Typography noWrap variant="h5">
            Rp {totalPay.toLocaleString("id-ID")}
          </Typography>
        </Box>
        <Box display="flex" marginY={1} justifyContent="flex-end">
          <Box width={100}>
            <Typography variant="subtitle2">Dibayarkan</Typography>
          </Box>
          <Box width={100}>
            <Typography noWrap align="right" variant="subtitle2">
              Rp {paying > 0 ? paying.toLocaleString("id-ID") : 0}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" marginY={1} justifyContent="flex-end">
          <Box width={100}>
            <Typography variant="subtitle2">Kembalian</Typography>
          </Box>
          <Box width={100}>
            <Typography noWrap align="right" variant="subtitle2">
              Rp {changes > 0 ? changes.toLocaleString("id-ID") : 0}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box marginY={1}>
          <Typography variant="h6">Tambahkan Pembayaran</Typography>
        </Box>
        <Box
          marginY={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex={1}>
            <Typography variant="body1">Cash</Typography>
          </Box>
          <Box flex={2} textAlign="right">
            <MyTextField
              type="number"
              value={cash}
              name="cash"
              disabled={credit > 0 || colData.length < 1 ? true : false}
              onChange={(v) => handelChangePay(v.target.name, v.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalAtmIcon />
                  </InputAdornment>
                ),
              }}
              label="Masukkan total belanja"
              variant="outlined"
            />
          </Box>
        </Box>
        <Box
          marginY={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex={1}>
            <Typography variant="body1">Credit Card</Typography>
          </Box>
          <Box flex={2} textAlign="right">
            <MyTextField
              type="number"
              value={credit}
              name="credit"
              disabled={cash > 0 || colData.length < 1 ? true : false}
              onChange={(v) => handelChangePay(v.target.name, v.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon />
                  </InputAdornment>
                ),
              }}
              label="Masukkan total belanja"
              variant="outlined"
            />
          </Box>
        </Box>
        <Box textAlign="center" marginY={1}>
          <Button
            onClick={() => handelPay()}
            disabled={btnPay || isLoading}
            variant="contained"
            color="primary"
            style={{ width: 100, height: 40 }}
          >
            {isLoading ? (
              <CircularProgress style={{ color: "white" }} size={25} />
            ) : (
              "Bayar"
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
