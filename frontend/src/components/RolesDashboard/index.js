import React, { useState, useEffect } from "react";
import axios from "../../config/axiosInstance";

import Header from "../Shared/Header";
import Category from "./Category";

import userInstance from "../../config/userInstance";

function Roles() {
  const [ user, setUser ] = useState( userInstance );
  const [ usersRoles, setUsersRoles ] = useState( [] );

  const [ all, setAll ] = useState( [] );
  const [ roles, setRoles ] = useState( [] );
  const [ cats, setCats ] = useState( [] );
  const [ catRoles, setCatRoles ] = useState( [] );
  const [ runningBackRoles, setRunningBackRoles ] = useState( true );

  const [ add, setAdd ] = useState( [] );
  const [ remove, setRemove ] = useState( [] );
  const [ results, setResults ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ error, setError ] = useState( false );

  const [ loading, setLoading ] = useState( true );
  const [ submitted, setSubmitted ] = useState( false );
  const [ err, setErr ] = useState( false );

  useEffect( () => {
    const fetchData = async () => {
      const fetchUser = ( await
        axios.get( '/api/user' )
      ).data;
      setUser( fetchUser );
      
      if ( fetchUser && fetchUser.id ) {
        const fetchCats = ( await
          axios.get( '/notion/categories' )
        ).data;
        setCats( fetchCats );

        const fetchRoles = ( await
          axios.get( '/api/roles' )
        ).data;
        setAll( fetchRoles );        
        
        await fetchSetUserRoles( fetchUser.id );
        setLoading( false );
      };
    };

    fetchData();
  }, [] );

  useEffect( () => {
    const filterRoles = ( roles, name ) => 
      roles.filter( role => 
        role.category === name 
      );

    const doCatRoles = () => {
      const result = cats.map( solo => {        
        const filterArr = filterRoles( roles, solo.name );
        return { category: solo, roles: filterArr };
      } );
      setCatRoles( result );
    };

    doCatRoles();
  }, [ roles, cats ] );

  useEffect( () => { 
    if ( runningBackRoles ) {
      setRoles( availableRoles() );
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ usersRoles ] );

  const fetchSetUserRoles = async ( userId ) => {
    if ( !userId ) { return false; };
    const fetch = ( await
      axios.get( `/api/user-roles/${ userId }` )
    ).data;
    setUsersRoles( fetch );
  };

  const availableRoles = ( outer = all, inner = usersRoles ) => 
    outer.filter( han => 
      !inner.find( solo => han.name === solo.name ) 
    );

  const reset = async ( theUser = user ) => {
    setAdd( [] );
    setRemove( [] );
    await fetchSetUserRoles( theUser.id );
  };

  const handleSubmit = async ( e ) => {
    const result = await axios.post( '/api/process', { 
      userId: user.id, 
      add, 
      remove 
    } );
    if ( result.status === 200 ) {
      setResults( result.data );
      const rAdd = result.data.add
      const rRemove = result.data.remove;
      if ( rAdd.success.length > 0 || rRemove.success.length > 0 ) {
        setSuccess( true );
      };
      if ( rAdd.error.length > 0 || rRemove.error.length > 0 ) {
        setError( true );
      };
      
      // Reset
      await reset();
      setSubmitted( true );
      setTimeout( () => 
        setSubmitted( false ), 6000 
      );
    } else {
      const status = result.status ? result.status : 'Unknown :/';
      setErr( status );
      setTimeout( () => 
        setErr( false ), 4000 
      );
    };
  };

  const handleCancel = async ( e ) => {
    setLoading( true );
    await reset();
    setLoading( false );
  };

  const handleAddRole = ( roleId ) => 
    handleChange( roleId, setRoles, setAdd );

  const handleCancelAdd = ( roleId ) => 
    handleChange( roleId, setAdd, setRoles );

  const handleRemoveRole = ( roleId ) => {
    function dontRedoRoles() {
      Promise.resolve()
        .then( () => setRunningBackRoles( false ) )
        .then( () => { setUsersRoles( prev => prev.filter( role => role.id !== roleId ) ) } )
        .then( () => setRunningBackRoles( true ) )
    };
    dontRedoRoles();
    handleSecondHalfChange( roleId, setRemove );
  };

  const handleCancelRemove = ( roleId ) => 
    handleChange( roleId, setRemove, setUsersRoles );

  const handleSecondHalfChange = ( roleId, setOtherArr ) => {
    const role = all.find( role => role.id === roleId );
    setOtherArr( prev => [ ...prev, role ] );
  };

  const handleChange = ( roleId, setArr, setOtherArr ) => {
    setArr( prev => prev.filter( role => role.id !== roleId ) );
    handleSecondHalfChange( roleId, setOtherArr );
  };

  return (
  <div className="container">
    <Header 
      user={ user } 
    />
    <div className="section">
      
      { submitted && 
      <div>
          
        { success && 
        <div>          
          <span>Successfully submitted changes:</span>
          <div>
          <ul>
          { results.add.success.length > 0 &&
          <>
            { results.add.success.map( role => 
              <li key={ role.name }>
                <span>Successfully added:</span> { role.name }
              </li>
            ) }
            </>
          }
          { results.remove.success.length > 0 &&
          <>
            { results.remove.success.map( role => 
              <li key={ role.name }>
                <span>Successfully removed:</span> { role.name }
              </li>
            ) }
          </>
          }
          </ul>
          </div>
        </div>
        }

        { error && 
        <div>
          <span>There were submission errors:</span>
          <div>
          <ul>
          { results.add.error.length > 0 &&
          <>
            { results.add.error.map( role => 
              <li key={ role.name }>
                <span>Failed to add:</span> { role.name }
              </li>
            ) }
            </>
          }
          { results.remove.error.length > 0 &&
          <>
            { results.remove.error.map( role => 
              <li key={ role.name }>
                <span>Failed to remove:</span> { role.name }
              </li>
            ) }
          </>
          }
          </ul>
          </div>
        </div>
        }
      </div>
    }

      { err && 
      <div>
        Sorry. An error occured. Got an HTTP Status Code of { err } 
      </div>
      }

      <h4>
        Your Channel & Role Options, { user && user.username } 
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
        handleRole={ handleCancelAdd } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <div className="section">
      <Category 
        name="To Remove" 
        roles={ remove } 
        handleRole={ handleCancelRemove } 
        loading={ loading } 
      />
    {/* div.section */}
    </div>

    <hr />

    <div className="section">
    { 
      ( catRoles.length > 0 ) && catRoles.map( ( theCatRoles, index ) =>  ( 
        <Category 
          key={ theCatRoles.category.name + index } 
          name={ theCatRoles.category.name } 
          description={ theCatRoles.category.description } 
          roles={ theCatRoles.roles } 
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
