import React from "react";

function Home() {
  return (
    <div className="container text-center">
      <div className="section">
        <h1>
          Zoomers Community 👩🏼‍💻 🌈
        </h1>
      </div>

      <div className="heading-block justify-content-center">
        <img 
          id="guild-icon" 
          className="rounded-circle" 
          src="images/discord-small.png" 
          alt="Guild icon" 
        />
        <img 
          id="guild-icon" 
          className="rounded-circle" 
          src="images/zoomers-cat.png" 
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
        <a href="/login" className="btn" id="login-button">
          <img src="images/discord-logo.png" alt="discord-sign-in-button" />
        </a>
      </div>
    </div>
  );
};

export default Home;