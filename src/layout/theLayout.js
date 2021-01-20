import { Box, CssBaseline, makeStyles } from "@material-ui/core";
import React from "react";
import Content from "./content";
import Header from "./header";
import Sidebar from "./sidebar";

const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: 64,
    flexGrow: 1,
  },
}));

export default function TheLayout(props) {
  const classes = useStyles();

  return (
    <Box style={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar {...props} />
      <Header {...props} />
      <Box className={classes.content}>
        <Content />
      </Box>
    </Box>
  );
}
