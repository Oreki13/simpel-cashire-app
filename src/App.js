import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import React, { lazy, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "./component/loading";
import { AppContext } from "./context/index";
const MyApp = lazy(() => import("./layout/theLayout"));

function App() {
  const { myTheme, mainPrimaryColor, mainSecondaryColor } = useContext(
    AppContext
  );

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: myTheme,
          primary: {
            main: mainPrimaryColor,
          },
          secondary: {
            main: mainSecondaryColor,
          },
        },
      }),
    [myTheme]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <React.Suspense fallback={() => <Loading />}>
          <Switch>
            <Route
              path="/"
              name="Home"
              component={(props) => <MyApp {...props} />}
            />
          </Switch>
        </React.Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
