const { Client } = require( '@notionhq/client' );
const { notion: notionConfig } = require( './config.json' );

// Initializing a client
const notion = new Client( {
  auth: notionConfig.token 
} );

const excludeAdmin = ( arrObj ) => 
  arrObj.filter( solo => 
    solo != null && solo.category.toLowerCase() != 'admin/helpers'
  );

const parseNotionDb = ( obj ) => {
  const arrMap = obj[ 'results' ].map( solo => { 
    const props = solo[ 'properties' ];
    const catRoot = props[ 'Tags' ];
    const nameRoot = props[ 'Name' ];
    const colorRoot = props.hasOwnProperty( 'Color' ) ? props[ 'Color' ] : null;

    const catArr = catRoot[ catRoot[ 'type' ] ];
    const category = ( Array.isArray( catArr ) && catArr.length ) ? catArr[ 0 ][ 'name' ] : '';
    // const color = ( Array.isArray( catArr ) && catArr.length ) ? catArr[ 0 ][ 'color' ] : '';

    const nameArr = nameRoot[ nameRoot[ 'type' ] ];
    const name = ( Array.isArray( nameArr ) && nameArr.length ) ? nameArr[ 0 ][ 'plain_text' ] : '';

    const colorArr = colorRoot[ colorRoot[ 'type' ] ];
    const color = ( Array.isArray( colorArr ) && colorArr.length ) ? colorArr[ 0 ][ 'name' ] : '';
    
    if ( category || name ) {
      if ( color ) {
        return { 
          category, 
          name, 
          color 
        };
      } else {
        return { 
          category, 
          name 
        };
      };
    } else {
      return null;
    };
  } );

  return excludeAdmin( arrMap );
};

const notionRoles = async () => {
  const result = await notion.databases.query( {
    database_id: notionConfig.roles
  } );

  return parseNotionDb( result );
};

const notionCategories = async () => {
  const result = await notion.databases.query( {
    database_id: notionConfig.role_categories
  } );

  return parseNotionDb( result );
};

const addNotionCategoriesToRoles = async ( cats = [], roles = [] ) => {
  const catsArr = ( Array.isArray( cats ) && cats.length ) ? cats : await notionCategories();
  const rolesArr = ( Array.isArray( roles ) && roles.length ) ? roles : await notionRoles();

  return rolesArr.map( solo => { 
    const catRow = catsArr.find( han => solo.category.toLowerCase() === han.name.toLowerCase() );
    return { ...solo, category: catRow.name, color: catRow.color };
  } );
};

// /roles
const getNotionRoles = async ( req, res ) => {
  const obj = await notionRoles();
  res.json( obj );
};

// /categories
const getNotionCategories = async ( req, res ) => {
  const obj = await notionCategories();
  res.json( obj );
};

module.exports = {
  notionCategories, 
  notionRoles, 
  
  addNotionCategoriesToRoles, 

  getNotionCategories, 
  getNotionRoles 
};
