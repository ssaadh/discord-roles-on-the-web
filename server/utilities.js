const sleepy = ( ms ) => new Promise( resolve => setTimeout( resolve, ms ) );
module.exports = {
  sleepy, 
};
