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
  securityCheck 
} = require( './utilities' );

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
  if ( !securityCheck( req.session.bearer_token, req.headers.bearer_token ) ) { res.status( 401 ).end(); return; }
  
  let { userId, add, remove } = req.body;
  add = add ? add : [];
  remove = remove ? remove : [];

  // Verify it is the same user
  const userInfo = await getDiscordUser( req.session.bearer_token );
  if ( userInfo && ( userInfo.id != userId ) ) {
    console.error( '/process -- user id not matching for' );
    console.error( 'userInfo.id', userInfo.id );
    console.error( 'userId', userId );
    res.sendStatus( 401 ); return;
  };
  
  if ( add.length === 0 && remove.length === 0 ) {
    res.sendStatus( 403 ); return; // @TODO
  };

  const obj = returnObj( userId );
  obj.add = await goThroughRoles( add, addRole, obj.add, userId );
  obj.remove = await goThroughRoles( remove, deleteRole, obj.remove, userId );
  res.json( obj );
};

module.exports = {
  getUser, 
  getRoles, 
  getUsersRoles, 
  postProcess 
};
