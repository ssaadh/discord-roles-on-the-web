const axios = require( 'axios' );

const { 
  discord, 
  bot, 
  guild 
} = require( './config.json' );

const { 
  addNotionCategoriesToRoles 
} = require( './notion' );

const {
  securityCheck, 
  isGuildMember 
} = require( './utilities' );

const grabRoles = async () => {
  let response;
  try {
    response = await axios.get( 
      discord.api + 'guilds/' + guild.id + '/roles', {
        headers: {
          'Authorization': 'Bot ' + bot.token
        }
      } 
    );
  } catch ( err ) {
    console.error( 'discord guild roles fail, status', err.response.status );
    console.error( 'discord guild roles fail, data', err.response.data );
    return false;
  };
  const json = response.data;
  return json.map( solo => {
    return {
      id: solo.id, 
      name: solo.name, 
      position: solo.position 
    };
  } );
};

const getDiscordUser = async ( bearerToken ) => {
  let user;
  try {
    user = await axios.get( discord.api + 'users/@me', {
      headers: {
        'Authorization': 'Bearer ' + bearerToken 
      }
    } );
  } catch ( err ) {
    console.error( 'discord user fail, status', err.response.status );
    console.error( 'discord user fail, data', err.response.data );
    return false;
  };
  return user.data;
};

const getDiscordUserGuilds = async ( bearerToken ) => {
  let guilds;
  try {
    guilds = await axios.get( discord.api + 'users/@me/guilds', {
      headers: {
        'Authorization': 'Bearer ' + bearerToken
      }
    } );
    if ( guilds.status === 401 ) {      
      return false;
    };
  } catch ( err ) {
    console.error( 'discord user guild fail, status', err.response.status );
    console.error( 'discord user guild fail, data', err.response.data );
    return false;
  };
  return guilds.data;
};

const grabUser = async ( req, res ) => {
  if ( !securityCheck( req.session.bearer_token, req.headers.bearer_token ) ) { res.status( 401 ).end(); return; }

  const user = await getDiscordUser( req.session.bearer_token );
  const guilds = await getDiscordUserGuilds( req.session.bearer_token );

  return {
    id: user.id, 
    username: user.username, 
    discriminator: user.discriminator, 
    avatar: user.avatar, 
    isAZoomer: isGuildMember( guilds, guild.id ) 
  };
};

const mergeNotionDiscordRoles = async () => {
  const notionRoles = await addNotionCategoriesToRoles();
  const discordRoles = await grabRoles();

  const mergedRoles = notionRoles.map( solo => { 
    const currRole = discordRoles.find( han => 
      han.name.toLowerCase() === solo.name.toLowerCase() 
    );
    return currRole != undefined ? { ...solo, ...currRole } : null;
  } )

  return mergedRoles.filter( han => han != null );
};

const filterRoles = async ( rolesArr = [] ) => {
  const roles = await mergeNotionDiscordRoles();
  return ( Array.isArray( rolesArr ) && rolesArr.length ) 
  ? 
    roles.filter( han => 
      rolesArr.find( solo => 
        han.id == solo 
      ) 
    )
  : 
    roles;
};

module.exports = { 
  filterRoles, 
  grabUser, 
  getDiscordUser 
};
