const express = require( 'express' );
const axios = require( 'axios' );
const bodyParser = require( 'body-parser' )

const { 
  grabUser 
} = require( './logic' );

const { 
  oauth2, 
  discord, 
  guild, 
  session 
} = require( './config.json' );

const app = express();
app.use( require( 'express-session' )( session ) );
const router = express.Router();

// Verify some basics are working
router.get( '/server', async ( req, res ) => {
  if ( !req.session.bearer_token ) {
    return res.redirect( '/login' );
  };

  const user = await grabUser( req, res );
  if ( !user.username ) {
    return res.redirect( '/login' );
  };

  res.send( 
    `<h1>Hello, ${ user.username }#${ user.discriminator }!</h1>` + 
    `<img src=${ discord.cdn }/avatars/${ user.id }/${ user.avatar }?size=512">` 
  );
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
      discord.api + 'oauth2/token', 
      new URLSearchParams( data ), 
      { headers: { 
        'Content-Type' : 'application/x-www-form-urlencoded' 
      } } 
    ) ).data;
    req.session.bearer_token = json.access_token;
  } catch ( err ) {
    console.error( 'err: ', err );
  };
  // Redirect to React app
  res.redirect( '/app' );
} );

router.get( '/logout', ( req, res ) => {
    req.session.bearer_token = null;
    res.redirect( '/' );
} );

router.get( '/add-bot', ( req, res ) => {
  const redirectUrl = req.protocol + '://' + req.get( 'host' ) + '/' + oauth2.redirect_uri;
  res.redirect( `${ discord.api }oauth2/authorize` + 
    `?client_id=${ oauth2.client_id }` + 
    '&scope=bot' + 
    '&permissions=139988565879' + 
    `&guild_id=${ guild.id }` + 
    '&disable_guild_select=false' 
  );
} );


// 
// All Routing
// 

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

const notion = express.Router();
const api = express.Router();

notion.route( '/categories' ).get( getNotionCategories );
notion.route( '/roles' ).get( getNotionRoles );

api.route( '/user' ).get( getUser );
api.route( '/user-roles/:userId' ).get( getUsersRoles );
api.route( '/roles' ).get( getRoles );
const jsonParser = bodyParser.json()
api.post( '/process', jsonParser, postProcess );

// @TODO path must route to firebase lambda - soon
// @TODO this will be done via rewriting in firebase i believe?
// app.use( '/', ( req, res ) => res.sendFile( path.join( __dirname, '../index.html' ) ) );
app.use( '/', router );
app.use( '/api', api );
app.use( '/notion', notion );

module.exports = app;
