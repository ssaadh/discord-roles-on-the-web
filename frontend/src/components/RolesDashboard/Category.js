import React, { useEffect, useState } from "react";
import Role from "./Role";

function Category( { name, description, roles, handleRole, loading } ) {
  const [ catRoles, setCatRoles ] = useState( [] );
  const cssName = name.trim().split( ' ' ).join( '-' ).toLowerCase();

  useEffect( () => {
    setCatRoles( roles );
  }, [ roles ] );

  const handleTheRole = ( e ) => {
    handleRole( e.target.id );
  };

  return (
  <div className="card">
      { loading && 
      <p className="text-center text-secondary">
        Loading...
      </p>
      }

      { !loading && 
      <>
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
              onClick={ handleTheRole } 
            />
          ) ) }
        </div>
        }
      </div> {/* <!-- #collapse-cat-roles --> */}
    {/* <!-- .card --> */}
    </>
    }
    </div>
  );
};

export default Category;
