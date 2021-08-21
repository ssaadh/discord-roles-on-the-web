import React, { useEffect, useState } from "react";
import Role from "./Role";

function Category( { name, roles, handleRole, loading } ) {
  const [ catRoles, setCatRoles ] = useState( [] );
  const cssName = name.trim().split( ' ' ).join( '-' ).toLowerCase();

  useEffect( () => {
    firstRun();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const firstRun = () => setCatRoles( filterCatRoles( name ) );

  const filterCatRoles = ( name ) => { 
    roles.filter( role => 
      role.category === name
    );
  };

  const handleCatRole = ( e ) => {
    e.preventDefault();
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
      </div>
      <div 
        id={ `collapse-${ cssName }-roles` }
        className="collapse show" 
      >
        { 
          <div className="card-body" id={ `${ cssName }-roles-container` }>
            { catRoles.map( role => ( 
              <Role 
                category={ cssName } 
                id={ role.id } 
                name={ role.name } 
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