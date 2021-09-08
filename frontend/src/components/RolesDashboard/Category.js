import React, { useEffect, useState } from "react";
import Role from "./Role";

function Category( { name, description, roles, handleRole, loading, filter } ) {
  const [ catRoles, setCatRoles ] = useState( [] );
  const cssName = name.trim().split( ' ' ).join( '-' ).toLowerCase();

  useEffect( () => {
    prepRoles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ roles ] );

  const firstRun = () => {
    if ( name && Array.isArray( roles ) && roles.length > 0 ) {
      if ( filter ) {
        setCatRoles( filterRoles( roles, name ) );
      } else if ( !filter ) {
        setCatRoles( roles );
      };
    };
  };

  const filterRoles = ( roles, name ) => 
    roles.filter( role => 
      role.category === name
    );

  const handleCatRole = ( e ) => {
    const id = e.target.id;
    const index = catRoles.findIndex( role => role.id === id );
    if ( index === -1 ) {
      return;
    };
    const currRole = catRoles[ index ];
    setCatRoles( prev => prev.splice( index, 1 ) );
    handleRole( currRole );
  };

  return (
  <div className="card">
      
      { loading && 
      <p className="text-center text-secondary">
        Loading...
      </p>
      }

      <div 
        id={ `${ cssName }-roles-header` }
        className="card-header" 
      >
        <h2 className="mb-0">
          <button 
            className="btn btn-block text-left" 
            type="button" 
          >
            { name } Channels
          </button>
        </h2>
        <span>{ description }</span>
      </div>
      <div 
        id={ `collapse-${ cssName }-roles` }
        className="collapse show" 
      >
        { 
          <div className="card-body" id={ `${ cssName }-roles-container` }>
            { Array.isArray( catRoles ) && catRoles.map( ( role, index ) => ( 
              <Role 
                key={ index } 
                category={ cssName } 
                id={ role.id } 
                name={ role.name } 
                description={ role.description } 
                color={ role.color } 
                onClick={ handleCatRole } 
              />
            ) ) }
          </div>
        }
      </div> {/* <!-- #collapse-cat-roles --> */}
    {/* <!-- .card --> */}
    </div>
  );
};

export default Category;
