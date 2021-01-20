import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { DataGrid } from "@material-ui/data-grid";
import { Box } from "@material-ui/core";
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

const columns = [
  { field: "name", headerName: "Name Item", width: 200 },
  { field: "price", headerName: "Harga Item", width: 130 },
];

export default function DialogShop({
  open,
  handleClose,
  colDataTrans,
  setColDataTrans,
  setTotalPay,
  totalPay,
}) {
  const [colData, setColData] = useState([]);
  const [firstCol, setFirstCol] = useState(undefined);
  const [lastCol, setLastCol] = useState(undefined);
  const [totalPage, setTotalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [select, setSelect] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = firebase
      .firestore()
      .collection("items")
      .orderBy("name")
      .limit(rowsPerPage)
      .onSnapshot((res) => {
        const listItems = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLastCol(res.docs[res.docs.length - 1]);
        setFirstCol(res.docs[0]);
        setColData(listItems);
        setIsLoading(false);
      });

    firebase
      .firestore()
      .collection("items")
      .get()
      .then((res) => {
        setTotalPage(res.docs.length);
      })
      .catch((e) => console.log(e));

    return () => unsubscribe();
  }, []);

  const nextPage = async () => {
    setIsLoading(true);
    await firebase
      .firestore()
      .collection("items")
      .orderBy("name")
      .startAfter(lastCol)
      .limit(rowsPerPage)
      .get()
      .then((res) => {
        const listItems = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLastCol(res.docs[res.docs.length - 1]);
        setFirstCol(res.docs[0]);
        setColData(listItems);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  };
  const prevPage = async () => {
    setIsLoading(true);
    await firebase
      .firestore()
      .collection("items")
      .orderBy("name")
      .endBefore(firstCol)
      .limitToLast(rowsPerPage)
      .get()
      .then((res) => {
        const listItems = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLastCol(res.docs[res.docs.length - 1]);
        setFirstCol(res.docs[0]);
        setColData(listItems);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const handleChangePage = (newPage) => {
    if (newPage.page === page) {
      return;
    }

    if (page < newPage.page) {
      nextPage();
      setPage(newPage.page);
    } else {
      prevPage();
      setPage(newPage.page);
    }
  };

  const handelSubmit = () => {
    let fromBack = JSON.parse(JSON.stringify(colDataTrans));
    let tmp = [];
    let pay = 0;

    for (let i = 0; i < select.length; i++) {
      const fill = colData.filter((col) => col.id === select[i]);
      tmp.push(fill[0]);
    }

    const list = tmp.map((data) => {
      const create = {
        ...data,
        qty: 1,
        total: parseInt(data.price),
        price: parseInt(data.price),
      };
      pay = pay + parseInt(data.price);
      fromBack.push(create);
    });
    setTotalPay(totalPay + pay);
    setColDataTrans(fromBack);
    handleClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Add Item
      </DialogTitle>
      <DialogContent dividers>
        <Box style={{ height: "60vh" }}>
          <DataGrid
            rows={colData.map((data) => ({
              ...data,
              price: "Rp " + parseInt(data.price).toLocaleString("id-ID"),
            }))}
            columns={columns}
            loading={isLoading}
            pageSize={rowsPerPage}
            page={page}
            rowCount={totalPage}
            paginationMode="server"
            onPageChange={(e) => handleChangePage(e)}
            checkboxSelection
            onSelectionChange={(newSelection) => {
              setSelect(newSelection.rowIds);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handelSubmit()} color="primary.light">
          Tambahkan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
