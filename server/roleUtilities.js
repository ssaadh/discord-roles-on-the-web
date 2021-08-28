const { default: axios } = require( 'axios' );

const { 
  discord, 
  bot, 
  guild 
} = require( './config.json' );

const {
  sleepy 
} = require( './utilities' );

// @TODO dont allow adding of privileged roles.
// Cant add roles above you in priority any way
const blockedRoles = ( arr, blockedArr ) => {
  return arr.filter( han => 
    !blockedArr.some( solo => han.id === solo.id )
  );
};

const getDiscordUsersRoles = async ( userId ) => {
  let result;
  try {
    result = await axios.get( discord.api + 'guilds/' + guild.id + '/members/' + userId,
      {
        headers: {
          'Authorization': 'Bot ' + bot.token
        }
      } 
    );
  } catch ( err ) {
    console.error( 'discord user\'s roles fail, status', err.response.status );
    console.error( 'discord user\'s roles fail, data', err.response.data );
    return false;
  };
  return result;
};

const roleApi = ( guildId, userId ) => `guilds/${ guildId }/members/${ userId }/roles/`;

const addRole = async ( userId, roleId ) => {
  try {
    await axios.put( discord.api + roleApi( guild.id, userId ) + roleId, 
    '', 
    {
      headers: {
        'Authorization': 'Bot ' + bot.token
      }
    } );
  } catch ( err ) {
    console.error( 'add role error status', err.response.status );
    console.error( 'add role error data', err.response.data );
    return false;
  };
  return true;
};

const deleteRole = async ( userId, roleId ) => {
  try {
    await axios.delete( discord.api + roleApi( guild.id, userId ) + roleId,
    {
      headers: {
        'Authorization': 'Bot ' + bot.token
      }
    } );        
  } catch ( err ) {
    console.error( 'remove role error status', err.response.status );
    console.error( 'remove role error data', err.response.data );
    return false;    
  };
  return true;
};

const goThroughRoles = async ( arr, func, obj, userId ) => {
  for ( const role of arr ) {    
    const result = await func( userId, role.id );
    if ( result ) {
      obj.success.push( role );
    } else {
      obj.error.push( role );
    };
    await sleepy( 125 );
  };
  return obj;
};

const returnObj = ( userId ) => { 
  return { 
    userId: userId, 
    add: { 
      success: [], 
      error: [] 
    }, 
    remove: { 
      success: [], 
      error: [] 
    } 
  } 
};

module.exports = {
  getDiscordUsersRoles, 
  addRole, 
  deleteRole, 
  goThroughRoles, 
  returnObj 
};
