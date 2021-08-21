const axios = require( 'axios' );

const { 
  discord, 
  bot, 
  guild 
} = require( './config.json' );

const { 
  notionCategories, 
  notionRoles, 
  addNotionCategoriesToRoles 
} = require( './notion' );

const grabRoles = async () => {
  let response = await axios.get( 
    DISCORD_API + 'guilds/' + guild.id + '/roles', {
      headers: {
        'Authorization': 'Bot ' + bot.token
      }
    } 
  );

  const json = response.data;
  return json.map( solo => {
    return {
      id: solo.id, 
      name: solo.name, 
      position: solo.position 
    };
  } );
};

const grabUser = async ( req, res ) => {
  // const token = req.session.bearer_token || '';
  const token = req.session.bearer_token;
  console.log( token );

  const user = await axios.get( discord.api + 'users/@me', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  } );
  if ( user.status === 401 ) {
    res.status( 401 );
    res.redirect( '/auth-mistake' );
  };

  const guilds = await axios.get( discord.api + 'users/@me/guilds', {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  } )
  if ( guilds.status === 401 ) {
    res.status( 401 );
  };

  const userInfo = user.data;
  const guildInfo = guilds.data;

  const isAZoomer = ( guildsArray, guildId ) => 
    guildsArray.filter( guild => guild[ 'id' ] === guildID ).length > 0;

  const userObj = {
    id: userInfo.id, 
    username: userInfo.username, 
    avatar: userInfo.avatar, 
    discriminator: userInfo.discriminator, 
    isAZoomer: isAZoomer( guilds, guild.id ) 
  };

  return JSON.stringify( userObj );
};

const mergeRoles = async ( rolesArr = [] ) => {
  const notionRoles = await addNotionCategoriesToRoles();
  const roles = ( Array.isArray( rolesArr ) && rolesArr.length ) ? rolesArr : await getRoles();

  return notionRoles.map( solo => { 
    const currRole = roles.find( han => han.name.toLowerCase() === solo.toLowerCase() );
    return { ...solo, ...currRole };
  } );
};

module.exports = { 
  mergeRoles, 
  grabRoles, 
  grabUser 
};
