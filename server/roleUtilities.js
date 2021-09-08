const { default: axios } = require( 'axios' );

const { 
  discord, 
  bot, 
  guild 
} = require( './config.json' );

const {
  sleepy, 
  logDiscordErr 
} = require( './utilities' );

const { 
  grabGuildUser 
} = require( './logic' );

// @TODO dont allow adding of privileged roles.
// Cant add roles above you in priority any way
const blockedRoles = ( arr, blockedArr ) => {
  return arr.filter( han => 
    !blockedArr.some( solo => han.id === solo.id )
  );
};

const getDiscordUsersRoles = async ( userId ) => {
  const result = await grabGuildUser( guild.id, userId );
  if ( result ) {
    return result.roles;
  };
  return false;
};

const roleApi = ( guildId, userId ) => `guilds/${ guildId }/members/${ userId }/roles/`;

const addRole = async ( userId, roleId ) => {
  try {
    await axios.put( 
      discord.api + roleApi( guild.id, userId ) + roleId, 
      '', 
      { headers: {
          'Authorization': 'Bot ' + bot.token
      } } 
    );
  } catch ( err ) {
    logDiscordErr( err, 'add role' );
    return false;
  };
  return true;
};

const deleteRole = async ( userId, roleId ) => {
  try {
    await axios.delete( 
      discord.api + roleApi( guild.id, userId ) + roleId,
      { headers: {
          'Authorization': 'Bot ' + bot.token
      } } 
    );
  } catch ( err ) {
    logDiscordErr( err, 'delete/remove roles' );
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
