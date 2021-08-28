const { default: axios } = require( 'axios' );

const { 
  discord, 
  bot, 
  guild 
} = require( './config.json' );

const { 
  filterRoles, 
  grabUser, 
  getDiscordUser 
} = require( './logic' );

const {
  getDiscordUsersRoles, 
  addRole, 
  deleteRole, 
  goThroughRoles, 
  returnObj 
} = require( './roleUtilities' );

// /user
const getUser = async ( req, res ) => {
  const results = await grabUser( req, res );
  if ( results ) { 
    res.json( results );
  } else {
    res.status( 400 ).end(); return;
  };
};

// /roles
const getRoles = async ( req, res ) => {
  if ( !securityCheck( req.session.bearer_token, req.headers.bearer_token ) ) { res.status( 401 ).end(); return; }
  const results = await filterRoles();
  if ( results ) { 
    res.json( results );
  } else {
    res.status( 400 ).end(); return;
  };
};

// '/user-roles/:userId'
const getUsersRoles = async ( req, res ) => {
  if ( !securityCheck( req.session.bearer_token, req.headers.bearer_token ) ) { res.status( 401 ).end(); return; }

  const userId = req.params.userId;
  if ( !userId ) {
    console.error( 'no param for userroles' );
    res.status( 400 ).end(); return;
  };

  const result = await getDiscordUsersRoles( userId );
  const roles = await filterRoles( result.data.roles );  
  res.json( roles );
};

// /process
const postProcess = async ( req, res ) => {
  if ( !req.session.bearer_token ) {
    res.status( 401 );
    return;
  };
  console.log( 'Routing /processing' );

  const { userId, add, remove } = req.body;
  if ( adding.type != 'json' ) {
    console.error( 'Bad data: ' + adding.type );
    res.status( 400 ); // @TODO
  };

  // @TODO block roles

  if ( add.length === 0 && remove.length === 0 ) {
    res.status( 403 ); // @TODO
    return;
  };  

  for ( const role of add ) {
    console.log( 'adding meow' );
    await wait( 1000 );
    await addRole( role.id );
  };
  
  for ( const role of remove ) {
    console.log( 'removing meow' );
    await wait( 1000 );
    await deleteRole( role.id );
  };

  res.status( 200 );
};

module.exports = {
  getUser, 
  getRoles, 
  getUsersRoles, 
  postProcess 
};
