const sleepy = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) );

const securityCheck = ( sessionBearerToken, manualToken = null ) => 
  ( !sessionBearerToken && !manualToken ) ? false : true;

const isGuildMember = ( guildsArr, guildId ) => 
  guildsArr.filter( guild => guild.id === guildId ).length > 0;

module.exports = {
  securityCheck, 
  sleepy, 
  isGuildMember 
};
