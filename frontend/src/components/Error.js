import React, { useEffect } from "react";

function Error( props ) {
  useEffect( () => { 
    setTimeout( () => 
      props.history.push( '/' ), 6000 
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  return (
    <div>
      <p>Something went wrong. Have to go back to logging in.</p>
      <p><a href="/">Click here to do that</a> or you'll be redirected to the home page in a couple of seconds</p> 
    </div>
  );
};

export default Error;
