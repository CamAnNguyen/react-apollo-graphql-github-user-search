import { lazy, Suspense } from "react";
import { Router, Switch, Route } from "react-router-dom";

import { Loader } from "components/Loader";

import * as routes from "./constants";
import { history } from "./history";

const Home = lazy(() => import("pages/Home"));

export function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path={routes.HOME_PATH} component={Home} />
        </Switch>
      </Router>
    </Suspense>
  );
}
