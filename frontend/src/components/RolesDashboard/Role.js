import React from "react";

function Role( { id, name, color, category, onClick } ) {
  return ( 
    <div 
      className={ `role ${ category }-role` }
      style={ { borderColor: color, backgroundColor: color } } 
      id={ id } 
      onClick={ onClick } 
    >
      { name }
    </div>          
  );
};

export default Role;