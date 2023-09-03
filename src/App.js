import React, { Component, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./scss/style.scss";

const Login = React.lazy(() => import("./views/pages/login/Login"));
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

class App extends Component {
  render() {
    return (
      <Router>
        <Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Login} />
            <Route path="*" name="Home" component={DefaultLayout} />
          </Switch>
        </Suspense>
      </Router>
    );
  }
}

export default App;
