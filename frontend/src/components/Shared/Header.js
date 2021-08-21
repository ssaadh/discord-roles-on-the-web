/* eslint-disable react/jsx-no-target-blank */
import React from "react";

function Header() {
  return (
  <div className="row" id="nav">

    <div className="col-sm-12 col-md-6">
      <h2>Zoomers Discord Roles</h2>
    </div>
    
    <div className="offset-md-3 col-md-3 dropdown">
      <div className="heading-block justify-content-end dropdown-toggle" id="user-block" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false" data-offset="-5,10">
        
        <h4 className="heading-text" id="username">Username</h4>
        <img src="{ user.avatar }" className="heading-img rounded-circle" id="avatar-icon" alt="Avatar icon" />
        <div className="card-image"><img src="{ user.avatar }" alt="User Avatar" /></div>
        
        <div className="card-header">
          <div className="card-title h5">@{ user.username }#{ user.discriminator }</div>
          <div className="card-subtitle text-gray">ID: <code>{ user.id }</code><hr /></div>
        </div>
      </div>

      <div className="dropdown-menu dropdown-menu-right bg-dark" aria-labelledby="user-block">
        <p className="dropdown-item-text text-secondary">
          Comments or questions? Message @chase_ats#9103
        </p>
        <a className="dropdown-item text-primary" href="https://github.com/inoicouldalwaysturn2u" target="_blank">
          Open Source Code
        </a>
        <a className="dropdown-item text-danger" href="/api/logout">
          Logout
        </a>
      </div>

    </div> {/* <-- div.offset-md-3 col-md-3 dropdown --> */}

    <div className="heading-block justify-content-center">
      <img src="discord-small.png" className="rounded-circle" id="guild-icon" alt="Guild icon" />
    </div>

    <div className="heading-block justify-content-center">
      <h3 className="heading-text text-center">
        Zoomers Community
      </h3>
    </div>
  {/* <-- div#nav --> */}
  </div> 
  );
};

export default Header;