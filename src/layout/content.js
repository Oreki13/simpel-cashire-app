import { Box, Fade } from "@material-ui/core";
import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import routes from "../routes/routes";
const Loading = lazy(() => import("../component/loading"));

export default function Content() {
  return (
    <Box>
      <Suspense fallback={() => <Loading />}>
        <Switch>
          {routes.map((data, index) => {
            return (
              data.component && (
                <Route
                  key={index}
                  exact={data.exact}
                  path={data.path}
                  name={data.name}
                  component={(props) => (
                    <Fade>
                      <data.component {...props} />
                    </Fade>
                  )}
                />
              )
            );
          })}
          <Redirect from="/" to="/dashboard" />
        </Switch>
      </Suspense>
    </Box>
  );
}
