import React from "react";
import {
  Switch, 
  Route 
} from "react-router-dom";

import PrivateRoute from "./config/PrivateRoute";

import Home from "./components/Home";
import Error from "./components/Error";

import User from "./components/User";
import Roles from './components/RolesDashboard';

const Routing = ( props ) => (
  <Switch>
    <PrivateRoute path="/app">
      <User />
    </PrivateRoute>
    <PrivateRoute path="/roles">
      <Roles />
    </PrivateRoute>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/an-error">
      <Error />
    </Route>
  </Switch>
);

export default Routing;
