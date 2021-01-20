import { Box, CircularProgress, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { blue } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import firebase from "../config/firebase";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function DialogAddItems({ open, handleClose, setTotalPage }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = () => {
    setIsLoading(true);
    const data = {
      name: name,
      price: price,
      createdAt: firebase.firestore.Timestamp.now(),
    };
    firebase
      .firestore()
      .collection("items")
      .add(data)
      .then(() => {
        setName("");
        setPrice("");
        setIsLoading(false);
        firebase
          .firestore()
          .collection("items")
          .get()
          .then((res) => {
            setTotalPage(res.docs.length);
          })
          .catch((e) => console.log(e));
        handleClose();
      })
      .catch((e) => console.log(e));
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Modal title
      </DialogTitle>
      <DialogContent dividers>
        <Box marginY={2}>
          <MyTextField
            value={name}
            onChange={(v) => setName(v.target.value)}
            label="Name Item"
            variant="outlined"
          />
        </Box>
        <Box marginY={2}>
          <MyTextField
            value={price}
            onChange={(v) => setPrice(v.target.value)}
            label="Harga"
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isLoading}
          autoFocus
          onClick={() => onSubmit()}
          color="primary.light"
        >
          {isLoading ? (
            <CircularProgress size={25} color="primary.light" />
          ) : (
            "Tambahkan"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
