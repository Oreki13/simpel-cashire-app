import {
  AppBar,
  Box,
  IconButton,
  makeStyles,
  Switch,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { useContext } from "react";
import { AppContext } from "../context";
import routes from "../routes/routes";
import options from "../options";

const drawerWidth = options.drawerWidth;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
}));

export default function Header(props) {
  const pathName = props.location.pathname.split("/");
  const filterPath = routes.filter((route, index) => {
    return route.name.toLowerCase() === pathName[1].toLowerCase();
  });

  const getPath = filterPath.length > 0 ? filterPath[0].name : "Unknown";
  const classes = useStyles();
  const { openSidebar, darkMode, setDarkTheme, sidebar } = useContext(
    AppContext
  );
  return (
    <Box>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: sidebar,
        })}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: sidebar,
            })}
            color="inherit"
            aria-label="menu"
            onClick={() => openSidebar()}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {getPath}
          </Typography>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Dark Mode</p>
            <Switch
              color="secondary.light"
              checked={darkMode}
              onChange={() => setDarkTheme()}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
