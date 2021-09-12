import React from "react";
import {
  Redirect,
  Route,
} from "react-router-dom";

import useAuthed from "./customHooks";

const PrivateRoute = ( { children, ...rest } ) => {
  const auth = useAuthed();

  return (
    <Route { ...rest } render={ () => {
      return ( auth !== null ) 
        ? ( 
          auth === true 
          ? children 
          : <Redirect to='/' /> 
        )
        : 'Checking Authentication...'
    } } />
  );
};

export default PrivateRoute;
