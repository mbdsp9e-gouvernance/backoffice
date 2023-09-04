import React, { Suspense, Component } from "react";
import { Route, Switch } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

// routes config
import routes from "../routes";
import withParams from "../hooks/withParams";

class AppContent extends Component {
  render() {
    if (!sessionStorage.getItem("user")) {
      window.location.replace("/");
    }
    return (
      <CContainer lg>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    component={route.component}
                  />
                )
              );
            })}
          </Switch>
        </Suspense>
      </CContainer>
    );
  }
}

export default withParams(React.memo(AppContent));
