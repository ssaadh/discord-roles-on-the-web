import React, { useState, useEffect } from "react";

function About() {
  const [ user, setUser ] = useState( null );
  useEffect( () => {
    fetchData();
  }, [] );

  const fetchData = async () => {
    const response = await (
      await fetch( 'http://localhost:5000/user' )
    ).json();
    setUser( response );
  };

  return (
    <div class="card">
        <div class="card-image"><img src="{ user.avatarUrl(256) }" alt="User Avatar" /></div>
        <div class="card-header">
          <div class="card-title h5">@{ user.username }#{ user.discriminator }</div>
          <div class="card-subtitle text-gray">ID: <code>{ user.id }</code><hr /></div>
          <div class="card-body">
            <strong>Is a bot?</strong> { user.bot ? 'Yes' : 'No' }<br />
            <strong>Discord Nitro:</strong> { user.premiumType }<br />
            
            { ( user.userFlags.length > 0 ) &&
            <>
            <strong>Flags: </strong>
              <ul>
                { user.userFlags.map( f => ( 
                  <li>{ f }</li> 
                ) ) }
              </ul>
            </>
              }

            <hr />
          </div>
          <div class="card-footer">
            <strong>Registered on:</strong> { user.createdAt.toUTCString() }<br />
          </div>
        </div>
    </div>
  );
};

export default About;