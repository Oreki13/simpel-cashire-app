import { Container } from "@material-ui/core";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import TableComponentHistory from "../component/tableHistory";
import firebase from "../config/firebase";

export default function Dashboard() {
  const row = [
    "",
    "Tanggal dan Waktu",
    "Pembayaran",
    "Total Barang",
    "Total Harga",
  ];
  const [colData, setColData] = useState([]);
  const [firstCol, setFirstCol] = useState(undefined);
  const [lastCol, setLastCol] = useState(undefined);
  const [totalPage, setTotalPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = firebase
      .firestore()
      .collection("cashire")
      .orderBy("date", "desc")
      .limit(rowsPerPage)
      .onSnapshot((res) => {
        const listItems = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: dayjs(doc.data().date.toDate()).format("DD MMMM YYYY, H:mm"),
        }));
        setLastCol(res.docs[res.docs.length - 1]);
        setFirstCol(res.docs[0]);
        setColData(listItems);
        setIsLoading(false);
      });

    firebase
      .firestore()
      .collection("cashire")
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
      .collection("cashire")
      .orderBy("date", "desc")
      .startAfter(lastCol)
      .limit(rowsPerPage)
      .get()
      .then((res) => {
        const listItems = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: dayjs(doc.data().date.toDate()).format("DD MMMM YYYY, H:mm"),
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
      .collection("cashire")
      .orderBy("date", "desc")
      .endBefore(firstCol)
      .limitToLast(rowsPerPage)
      .get()
      .then((res) => {
        const listItems = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: dayjs(doc.data().date.toDate()).format("DD MMMM YYYY, H:mm"),
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

  return (
    <Container maxWidth="md">
      <h1 style={{ textAlign: "center" }}>History Transaction</h1>

      <TableComponentHistory
        isLoading={isLoading}
        colData={colData}
        rowData={row}
        data="asd"
        totalPage={totalPage}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />

      {/* <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">No</StyledTableCell>
              <StyledTableCell align="center">Tanggal</StyledTableCell>
              <StyledTableCell align="center">Pembayaran</StyledTableCell>
              <StyledTableCell align="center">Total Barang</StyledTableCell>
              <StyledTableCell align="center">Total Harga</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <FirestoreDocument path="/cashire/transaction">
              {(data) => {
                console.log(data);
                let count = 0;
                if (data.isLoading === false) {
                  return data.value.history.map((row) => {
                    count++;
                    return (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell align="center">
                          {count}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.date}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.payment.cash ? "Cash" : "Credit"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.data.length}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.total}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  });
                } else {
                  <p>loading</p>;
                }
              }}
            </FirestoreDocument>
          </TableBody>
        </Table>
      </TableContainer> */}
    </Container>
  );
}
