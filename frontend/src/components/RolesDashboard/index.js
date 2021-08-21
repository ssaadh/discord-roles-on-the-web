/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "../Shared/Header";
import Category from "./Category";

function Roles() {
  const [ user, setUser ] = useState( null );
  const [ usersRoles, setUsersRoles ] = useState( [] );

  const [ roles, setRoles ] = useState( [] );
  const [ cats, setCats ] = useState( [] );

  const [ add, setAdd ] = useState( [] );
  const [ remove, setRemove ] = useState( [] );

  const [ loading, setLoading ] = useState( true );
  const [ submitted, setSubmitted ] = useState( true );
  const [ err, setErr ] = useState( true );

  useEffect( () => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const fetchData = async () => {
    const fetchUser = ( await
      axios.get( '/api/user' )
    ).data;
    setUser( fetchUser );
    
    const fetchCats = ( await
      axios.post( '/notion/categories' )
    ).data;
    setCats( fetchCats );

    const fetchRoles = ( await
      axios.post( '/notion/roles' )
    ).data;
    setRoles( fetchRoles );
    
    await fetchUserRoles();
    // const fetchUsersRoles = ( await
    //   axios.get( `/api/user-roles/${ fetchUser.id }` )
    // ).data;
    // setUsersRoles( fetchUsersRoles );

    setLoading( false );
  };

  const fetchUserRoles = async () => {
    const fetch = ( await
      axios.get( `/api/user-roles/${ user.id }` )
    ).data;
    setUsersRoles( fetch );
  };

  const handleSubmit = async ( e ) => {
    e.preventDefault();
    const result = await axios.post( '/api/process', { 
      userId: user.id, 
      add, 
      remove 
    } );
    if ( result.status === 200 ) {
      console.log( 'successfully processed' );  

      // Reset
      setAdd( [] );
      setRemove( [] );
      await fetchUserRoles();

      setSubmitted( true );
      setTimeout( () => 
        setSubmitted( false ), 6000 
      );
    } else {
      const status = result.status ? result.status : 'Unknown :/';
      setErr( status );
      setTimeout( () => 
        setErr( false ), 6000 
      );
    }
  };

  const handleCancel = ( e ) => {
    e.preventDefault();
    window.location.reload();
  };

  const handleAddRole = ( role ) =>
    setAdd( prev => prev.push( role ) );

  const handleRemoveRole = ( role ) => 
    setRemove( prev => prev.push( role ) );

  return (
  <div className="container">
    <Header />
    <div className="section">
      
      { submitted && 
      <div>
        Successfully submitted changes!
      </div>
      }
      { err && 
      <div>
        Sorry. An error occured. Got an HTTP Status Code of { err } 
      </div>
      }

      <h4>
        Your Channel & Role Options, { user.name } 
      </h4>
      <div 
        id="controls"
        className="section text-center" 
      >
        <button 
          id="submit-changes" 
          className="btn btn-outline-primary" 
          onClick={ handleSubmit }
        >
          Submit Changes
        </button>
        <button 
          id="reset" 
          className="btn btn-outline-danger" 
          onClick={ handleCancel }
        >
          Cancel
        </button>
        {/* div#controls */}
      </div>
    {/* div.section */}
    </div>

    <div className="section">
      <Category 
        name="Current" 
        roles={ usersRoles } 
        handleRole={ handleRemoveRole } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <div className="section">
      <Category 
        name="To Add" 
        roles={ add } 
        handleRole={ handleRemoveRole } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <div className="section">
      <Category 
        name="To Remove" 
        roles={ remove } 
        handleRole={ handleAddRole } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <hr />

    <div className="section">
    { 
      cats.map( cat =>  ( 
        <Category 
          category={ cat }
          name={ cat.name } 
          roles={ roles } 
          handleRole={ handleAddRole } 
          loading={ loading } 
        />
      ) ) 
    }
    {/* div.section */}
    </div>
  {/* div.container */}
  </div>
  );
};

export default Roles;