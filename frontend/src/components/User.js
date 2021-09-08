import React, { useState, useEffect } from "react";
import axios from "../config/axiosInstance";

import Header from "./Shared/Header";

function User() {
  const [ user, setUser ] = useState( null );
  useEffect( () => {
    fetchData();
  }, [] );

  const fetchData = async () => {
    const response = (
      await axios.get( '/user' )
    ).data;
    setUser( response );
  };

  return (
    <div className="container">
      <Header 
        user={ user } 
      />
      <div class="card">
        <div class="card-image"><img src="{ user.avatarUrl(256) }" alt="User Avatar" /></div>
        <div class="card-header">
          <div class="card-title h5">@{ user.username }#{ user.discriminator }</div>
          <div class="card-subtitle text-gray">ID: <code>{ user.id }</code><hr /></div>
          <div class="card-body">
            <h3>Guild Info</h3>
            <strong>Nick:</strong> { user.nick }<br />
            <strong>Joined Time:</strong> { user.joined }<br />            
            { ( user.flags ) &&
            <>
            <strong>Flag: </strong>
                { user.flags }
            </>
              }
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
