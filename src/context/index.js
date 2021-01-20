import { blue, deepPurple, indigo } from "@material-ui/core/colors";
import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const myTheme = darkMode ? "dark" : "light";
  const mainPrimaryColor = darkMode ? indigo[800] : blue[500];
  const mainSecondaryColor = darkMode ? deepPurple[700] : deepPurple[500];
  return (
    <AppContext.Provider
      value={{
        sidebar,
        myTheme,
        darkMode,
        mainPrimaryColor,
        mainSecondaryColor,
        setDarkTheme: () => {
          setDarkMode(!darkMode);
        },

        openSidebar: () => {
          setSidebar(true);
        },
        closeSidebar: () => {
          setSidebar(false);
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
