import { Box, Button, Container, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import TableItems from "../component/tableItems";
import firebase from "../config/firebase";
import DialogAddItems from "../component/dialogAddItems";

export default function Items() {
  const [colData, setColData] = useState([]);
  const [firstCol, setFirstCol] = useState(undefined);
  const [lastCol, setLastCol] = useState(undefined);
  const [totalPage, setTotalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
  }, [rowsPerPage]);

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

  const handleChangePage = (event, newPage) => {
    if (page < newPage) {
      nextPage();
      setPage(newPage);
    } else {
      prevPage();
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const rowData = ["Name", "Price", "Action"];
  return (
    <Container maxWidth="md">
      <Box
        marginY={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography align="center" variant="h3" component="h3">
          Items List
        </Typography>
        <Button
          onClick={() => handleClickOpen()}
          style={{ width: 180, height: 30 }}
          variant="contained"
        >
          Tambahkan Item
        </Button>
      </Box>

      <TableItems
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        rowData={rowData}
        colData={colData}
      />
      <DialogAddItems
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        setTotalPage={setTotalPage}
      />
    </Container>
  );
}
