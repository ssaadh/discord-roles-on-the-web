const { Client } = require( '@notionhq/client' );
const { notion: notionConfig } = require( './config.json' );

const { securityCheck } = require( './utilities' );

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
    const catObj = catRoot[ catRoot.type ];
    const category = checkNotionObject( catObj ) ? catObj.name : '';

    const nameRoot = props.Name;
    const nameArr = nameRoot[ nameRoot.type ];
    const name = ( Array.isArray( nameArr ) && nameArr.length ) ? nameArr[ 0 ].plain_text : '';

    const descriptionRoot = props.Description;
    const descriptionArr = descriptionRoot[ descriptionRoot.type ];
    const description = ( Array.isArray( descriptionArr ) && descriptionArr.length ) ? descriptionArr[ 0 ].plain_text : '';
    
    const colorRoot = props.hasOwnProperty( 'Color' ) ? props.Color : null;
    let color;
    if ( colorRoot !== null ) {
      const colorObj = colorRoot[ colorRoot.type ];
      color = checkNotionObject( colorObj ) ? colorObj.name : '';
    };
    
    const priorityRoot = props.hasOwnProperty( 'Priority' ) ? props.Priority : null;
    let priority;
    if ( priorityRoot !== null ) {
      prioritySpecific = priorityRoot[ priorityRoot.type ];
      priority = prioritySpecific ? prioritySpecific : 999;
    };

    if ( category || name ) {
      const obj = {
        category, 
        name, 
        description 
      };
      if ( colorRoot && color ) {
        obj.color = color;
      };
      if ( priorityRoot && priority ) {
        obj.priority = priority;
      };
      return obj;
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

  const arr = parseNotionDb( result );
  return arr.sort( ( a, b ) => a.priority - b.priority );
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
  if ( !securityCheck( req.session.bearer_token, req.headers.bearer_token ) ) { res.status( 401 ).end(); return; }
  const obj = await notionRoles();
  res.json( obj );
};

// /categories
const getNotionCategories = async ( req, res ) => {
  if ( !securityCheck( req.session.bearer_token, req.headers.bearer_token ) ) { res.status( 401 ).end(); return; }
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
