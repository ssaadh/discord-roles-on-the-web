import React from "react";

function Role( { id, name, description, color, category, onClick } ) {
  return ( 
    <div>
      <div 
        className={ `role ${ category }-role` }
        style={ { borderColor: color, backgroundColor: color } } 
        id={ id } 
        onClick={ onClick } 
      >
        { name }
      </div>
      { description }
    </div>

  );
};

export default Role;
