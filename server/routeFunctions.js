const { default: axios } = require( 'axios' );

const { 
  discord, 
  bot, 
  guild 
} = require( './config.json' );

const { 
  mergeRoles, 
  grabUser 
} = require( './logic' );

const wait = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) );

// /user
const getUser = async ( req, res ) => {
  if ( !req.session.bearer_token ) {
    res.status( 401 );
    return;
  };

  const results = await grabUser( req );
  res.json( results );
};

// /roles
const getRoles = async ( req, res ) => {
  if ( !req.session.bearer_token ) {
    res.status( 401 );
    return;
  };

  const results = await mergeRoles();
  res.json( results );
};

// '/user-roles/:userId'
const getUsersRoles = async ( req, res ) => {
  if ( !req.session.bearer_token ) {
    res.status( 401 );
    return;
  };  

  const userId = req.param( 'userId' );
  if ( !req.param( 'userId' ) ) {
    console.error( 'no param for userroles' );
    return;
  };
  console.log('GET user roles for ' + req.params.userid )

  const result = await axios.get( discord.api + 'guilds/' + guild.id + '/members/' + userId,
    {
      headers: {
        'Authorization': 'Bot ' + bot.token
      }
    } 
  );

  const roles = await mergeRoles( result[ 'roles' ] );
  res.json( result[ 'roles' ] );
};

// @TODO dont allow adding of privileged roles.
const blockedRoles = ( arr, blockedArr ) => {
  return arr.filter( han => 
    !blockedArr.some( solo => han.id === solo.id )
  );
};

const roleApi = `guilds/${ guild.id }/members/${ userId }/roles/`;

const addRole = async ( roleId ) => {
  try {
    const result = await axios.put( discord.api + roleApi + roleId, 
    {
      headers: {
        'Authorization': 'Bot ' + BOT_SECRET
      }
    } );

    if ( result.status === 429 ) {
      console.log( 'rate limited' );
    };
  } catch (err ) {
    console.error( err )
    res.status( 400 ); // @TODO
    return;
  };
};

const deleteRole = async ( roleId ) => {
  try {
    const result = await axios.delete( discord.api + roleApi + roleId,
    '', 
    {
      headers: {
        'Authorization': 'Bot ' + BOT_SECRET
      }
    } );

    if ( result.status === 429 ) {
      console.log( 'rate limited' );
    };
  } catch (err ) {
    console.error( err )
    res.status( 400 ); //@TODO
    return;
  };
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
