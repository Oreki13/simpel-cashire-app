import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import React, { useContext } from "react";
import { AppContext } from "../context/index";
import menu from "../routes/menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import clsx from "clsx";
import options from "../options";

const drawerWidth = options.drawerWidth;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const { sidebar, closeSidebar } = useContext(AppContext);
  return (
    <Drawer
      anchor={"left"}
      open={sidebar}
      onClose={closeSidebar}
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: sidebar,
        [classes.drawerClose]: !sidebar,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: sidebar,
          [classes.drawerClose]: !sidebar,
        }),
      }}
    >
      <Box style={{ width: 230 }}>
        <div className={classes.toolbar}>
          <IconButton onClick={closeSidebar}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {menu.map((data, index) => {
            return (
              <ListItem
                onClick={() => props.history.push(data.to)}
                button
                key={index}
              >
                <ListItemIcon>{data.icon}</ListItemIcon>
                <ListItemText primary={data.name} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
