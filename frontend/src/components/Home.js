import React, { useEffect, useState } from "react";
import axios from "../config/axiosInstance";
import { useHistory } from 'react-router-dom';

import catLogo from "../images/zoomers-cat.jpg"
import smallDiscordLogo from "../images/discord-small.png"
import discordLogo from "../images/discord-logo.png"

function Home( props ) {
  const history = useHistory();
  const [ loggedIn, setLoggedIn ] = useState( false );
  const [ showContent, setShowContent ] = useState( false );

  useEffect( () => { 
    const checkIfLoggedIn = async () => {
      const auth = await axios.get( '/check-auth' );
      if ( auth.status === 200 ) {
        setLoggedIn( true );
      } else if ( auth.status === 401 ) {
        setShowContent( true );
      } else { 
        setShowContent( true );
      };
    };

    checkIfLoggedIn();
  }, [] );

  useEffect( () => { 
    if ( loggedIn ) history.push( '/roles' );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ loggedIn ] );

  const handleLogin = async () => {
    const url = ( await axios.get( '/login' ) ).data
    window.location.href = url;
  };

  return (
    <div className="container text-center">
      { !showContent && 
      <p className="text-center text-secondary">
        Checking if logged in...
      </p>
      }
      { showContent && 
      <>
      <div className="section">
        <h1>
          Zoomers Community 👩🏼‍💻 🌈
        </h1>
      </div>
      
      <div className="heading-block justify-content-center">
        <img 
          id="guild-icon" 
          className="rounded-circle" 
          src={ smallDiscordLogo }
          alt="Guild icon" 
        />
        <img 
          id="guild-icon" 
          className="rounded-circle" 
          src={ catLogo } 
          alt="Guild icon" 
        />
      </div>

      <div className="heading-block justify-content-center section">
        <h3 className="heading-text text-center">
          Discord Channel Selection
        </h3>
      </div>

      <div className="container section text-secondary" id="privacy">
        <p>You can grant us access to basic Discord details: your Discord basic identity and that you are in the Zoomers Community Discord</p>
        <p>We do not have access to your login credentials. Only Discord has that information.</p>
        <p>Cheers!</p>
      </div>

      <div className="section">
        <p>Sign-in Securely with Discord</p>
        <span onClick={ handleLogin } className="btn" id="login-button">
          <img src={ discordLogo } alt="discord-sign-in-button" />
        </span>
      </div>
      </>
    }
    </div>
  );
};

export default Home;
