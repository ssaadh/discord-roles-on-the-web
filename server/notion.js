const { Client } = require( '@notionhq/client' );
const { notion: notionConfig } = require( './config.json' );

// Initializing a client
const notion = new Client( {
  auth: notionConfig.token 
} );

const excludeAdmin = ( arrObj ) => 
  arrObj.filter( solo => 
    solo != null && solo.category.toLowerCase() != 'Helpers/Admin'.toLowerCase() 
  );

const checkNotionObject = ( obj ) => 
  ( typeof obj == 'object' ) && ( Object.keys( obj ).length > 1 ) && obj.hasOwnProperty( 'name' )

const parseNotionDb = ( obj ) => {
  const arrMap = obj.results.map( solo => { 
    const props = solo.properties;
    const catRoot = props.Tags;
    const nameRoot = props.Name;
    const colorRoot = props.hasOwnProperty( 'Color' ) ? props.Color : null;

    const catObj = catRoot[ catRoot.type ];
    const category = checkNotionObject( catObj ) ? catObj.name : '';
    const nameArr = nameRoot[ nameRoot.type ];
    const name = ( Array.isArray( nameArr ) && nameArr.length ) ? nameArr[ 0 ].plain_text : '';

    let color;
    if ( colorRoot !== null ) {
      const colorObj = colorRoot[ colorRoot.type ];
      color = checkNotionObject( colorObj ) ? colorObj.name : '';
    };
    if ( category || name ) {
      if ( colorRoot && color ) {
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

  // Aren't categories already added to roles. What is the point of this then?
  // Color is being added, but the category is checking for matching so why overwrite a dupe?
  const merger = rolesArr.map( solo => { 
    const catRow = catsArr.find( han => solo.category.toLowerCase() === han.name.toLowerCase() );    
    return ( catRow != undefined ) ? { ...solo, category: catRow.name, color: catRow.color } : null;
  } );
  return merger.filter( han => han != null );
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
