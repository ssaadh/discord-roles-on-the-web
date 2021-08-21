const express = require( 'express' );
const axios = require( 'axios' );

const { 
  oauth2, 
  discord, 
  guild, 
  session 
} = require( './config.json' );

const { 
  getUser, 
  getRoles, 
  getUsersRoles, 
  postProcess 
} = require( './routeFunctions' );

const { 
  getNotionCategories, 
  getNotionRoles 
} = require( './notion' );

const app = express();
app.use( require( 'express-session' )( session ) );

const router = express.Router();
// const router = require( './routes' );

// test
router.get( '/schmoomu', ( req, res ) => { 
  res.writeHead( 200, { 'Content-Type': 'text/html' } );
  res.write( '<h1>Hello from Schmoomu in tha house!</h1>' );
  res.end();
} );
router.get( '/check-deux', ( req, res ) => res.json( { route: req.originalUrl } ) );
router.post( '/check', ( req, res ) => res.json( { postBody: req.body } ) );

router.get( '/', ( req, res ) => {
  console.log( req.session.bearer_token );
  if ( req.session.bearer_token ) {
    // Redirect to react app
    res.redirect( '/app' );
  };
} );

router.get( '/login/callback', async ( req, res ) => {
  const accessCode = req.query.code;
  if ( !accessCode ) {
    return res.send( 'No access code specified' );
  };

  const redirectUrl = req.protocol + '://' + req.get( 'host' ) + '/' + oauth2.redirect_uri;
  const data = {
    client_id: oauth2.client_id, 
    client_secret: oauth2.secret, 
    grant_type: 'authorization_code', 
    code: accessCode, 
    redirect_uri: redirectUrl, 
    scope: 'identify' // not needed
  };    

  try {
    const json = ( await axios.post( 
      'https://discord.com/api/oauth2/token', 
      new URLSearchParams( data ), 
      { headers: { 
        'Content-Type' : 'application/x-www-form-urlencoded' 
      } } 
    ) ).data;
    req.session.bearer_token = json.access_token;
  } catch ( err ) {
    console.log( 'err: ', err );
  };

  console.log( 'redirecting back home - login successful' );
  res.redirect( '/app' );
} );

router.get( '/login', ( req, res ) => {
  const redirectUrl = req.protocol + '://' + req.get( 'host' ) + '/' + oauth2.redirect_uri;
  res.redirect( `${ discord.api }oauth2/authorize` +
    `?client_id=${ oauth2.client_id }` +
    `&redirect_uri=${ encodeURIComponent( redirectUrl ) }` +
    `&response_type=code` +
    `&scope=${ encodeURIComponent( oauth2.scopes.join( ' ' ) ) }` 
  );
} );

router.get( '/logout', ( req, res ) => {
    // @TODO delete the bearer token somehow
    // req.session.bearer_token
    res.redirect( '/' );
} );

router.get( '/add-bot', ( req, res ) => {
  const redirectUrl = req.protocol + '://' + req.get( 'host' ) + '/' + oauth2.redirect_uri;
  res.redirect( `${ discord.api }oauth2/authorize` +
    `?client_id=${ oauth2.client_id }` +
    '&scope=bot' +
    '&permissions=268436496' +
    `&guild_id=${ guild.id }` +
    '&disable_guild_select=false' 
  );
} );

const api = express.Router();
const notion = express.Router();

notion.route( '/notion/categories' ).get( getNotionCategories );
notion.route( '/notion/roles' ).get( getNotionRoles );

api.route( '/user' ).get( getUser );
api.route( '/user-roles/:userId' ).get( getUsersRoles );
api.route( '/roles' ).post( getRoles );
api.route( '/process' ).post( postProcess );

// @TODO path must route to firebase lambda - soon
// app.use( '/', ( req, res ) => res.sendFile( path.join( __dirname, '../index.html' ) ) );
// @TODO this will be done via rewriting in firebase i believe?
app.use( '/', router );
app.use( '/api', api );
app.use( '/notion', notion );

module.exports = app;
