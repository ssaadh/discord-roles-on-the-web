import { useEffect, useRef, useState } from "react";
import axios from "./axiosInstance";

function useIsMounted() {
  const isMounted = useRef( true )
  useEffect( () => {
    return () => {
      isMounted.current = false;
    };
  }, [] );
  return isMounted;
};

function useAuthed() {
  const isMounted = useIsMounted();
  const [ auth, setAuthed ] = useState( null );

  useEffect( () => {
    axios.get( '/check-auth' ).then( result => { 
      if ( isMounted.current ) {
        if ( result.status === 200 ) {
          setAuthed( true );
        } else {
          setAuthed( false );
        };
      };
    } );
  }, [ isMounted ] );

  return auth;
};

export default useAuthed;
