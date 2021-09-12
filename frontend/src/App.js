import React from "react";
import { 
  BrowserRouter as Router, 
  Link, 
} from "react-router-dom";

import Routing from "./Routing";

import "./App.css";

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
    <Routing />
  </div>
  </Router>
  );
}

export default App;
