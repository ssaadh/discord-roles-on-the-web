const sleepy = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) );

const securityCheck = ( sessionBearerToken, manualToken = null ) => 
  ( !sessionBearerToken && !manualToken ) ? false : true;

const isGuildMember = ( guildsArr, guildId ) => 
  guildsArr.filter( guild => guild.id === guildId ).length > 0;

const logDiscordErr = ( err, text ) => {
  console.error( 
    `discord ${ text } fail, status`, 
    err.status || ( err.response && err.response.status ) || err
  );
  console.error( 
    `discord ${ text } fail, data`, 
    err.data || ( err.response && err.response.data ) || err
  );
  return true;
};


module.exports = {
  securityCheck, 
  sleepy, 
  isGuildMember, 
  logDiscordErr 
};
