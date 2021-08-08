const express = require( 'express' );
const axios = require( 'axios' );

const config = require( './config.json' );
const { oauth2, bot, guild, session } = config;
const app = express();
app.use( require( 'express-session' )( config.session ) );

const router = express.Router();
// const router = require( './routes' );

// test stuff
router.get( '/schmoomu', ( req, res ) => { 
  res.writeHead( 200, { 'Content-Type': 'text/html' } );
  res.write( '<h1>Hello from Schmoomu in tha house!</h1>' );
  res.end();
} );
router.get( '/check-deux', ( req, res ) => res.json( { route: req.originalUrl } ) );
router.post( '/check', ( req, res ) => res.json( { postBody: req.body } ) );


router.get( '/', async ( req, res ) => {
  if( !req.session.bearer_token ) {
    return res.redirect( '/login' );
  };
} );

router.get( '/login/callback', async ( req, res ) => {
    const accessCode = req.query.code;
    if ( !accessCode ) {
      return res.send( 'No access code specified' );
    };

    const data = {
      client_id: oauth2.client_id, 
      client_secret: oauth2.secret, 
      grant_type: 'authorization_code', 
      code: accessCode, 
      redirect_uri: oauth2.redirect_uri, 
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

    res.redirect( '/' );
} );

router.get( '/login', ( req, res ) => {
  res.redirect( `https://discord.com/api/oauth2/authorize` +
    `?client_id=${ oauth2.client_id }` +
    `&redirect_uri=${ encodeURIComponent( oauth2.redirect_uri ) }` +
    `&resonse_type=code&scope=${ encodeURIComponent( oauth2.scopes.join( ' ' ) ) }` )
} );

router.get( '/logout', ( req, res ) => {
    // @TODO delete the bearer token somehow
    // req.session.bearer_token
    res.redirect( '/' );
} );

// path must route to firebase lambda - soon
// app.use( '/', ( req, res ) => res.sendFile( path.join( __dirname, '../index.html' ) ) );
// this will be done via rewriting in firebase i believe?
app.use( '/api', router )

module.exports = app;
