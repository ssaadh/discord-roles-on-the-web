import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import "./App.css";

import Home from "./components/Home";
import Error from "./components/Error";

import User from "./components/User";
import Roles from './components/RolesDashboard';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/app">Dashboard</Link>
            </li>
            <li>
              <Link to="/roles">Channels/Roles</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/app">
            <User />
          </Route>
          <Route path="/roles">
            <Roles />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/an-error">
            <Error />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
