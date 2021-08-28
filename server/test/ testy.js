const express = require( 'express' );

const app = require{ './app' };
const { 
  postProcess 
} = require( './routeFunctions' );

const { 
  test 
} = require( 'config' );

const router = express.Router();

const { cookie } = './config.json';
app.use( require( 'cookie-session' )( {
  keys: ["testie1", "testor2"],
  secret: "testmexfortrixlol",
  cookie: {
    "maxAge": 24 * 60 * 60 * 1000 // a day
  }
} ) );

// test
router.get( '/schmoomu', ( req, res ) => { 
  res.writeHead( 200, { 'Content-Type': 'text/html' } );
  res.write( '<h1>Hello from Schmoomu in tha house!</h1>' );
  res.end();
} );
router.get( '/check-deux', ( req, res ) => res.json( { 
  route: req.originalUrl 
} ) );
router.post( '/check', ( req, res ) => res.json( { 
  postBody: req.body 
} ) );

router.get( '/server', async ( req, res ) => {
  if ( !req.session.bearer_token ) {
    return res.redirect( '/login' );
  };

  const user = await grabUser( req, res );
  // Verify it is correct
  if ( !user.username ) {
    return res.redirect( '/login' );
  };  

  const { test } = require( './config' );
  res.send( 
    `<h1>Hello, ${ user.username }#${ user.discriminator }!</h1>` + 
    `<img src=${ discord.cdn }/avatars/${ user.id }/${ user.avatar }?size=512">` +  
    '<hr /> <ul>' + 

    '<li><a href="/server/app">app</a></li>' + 

    '<li><a href="/notion/categories">Notion Categories</a></li>' + 
    '<li><a href="/notion/roles">Notion Roles</a></li>' + 

    '<li><a href="/api/user">Get User</a></li>' + 
    '<li><a href="/api/roles">Get Roles</a></li>' + 
    `<li><a href="/api/user-roles/${ test.userId }">Test User's Roles</a></li>` + 

    '<li><a href="/api/test/process">Test Process</a></li>' + 
    '</ul>'
  );
} );

const testPostProcess = async ( req, res ) => {
  req.session.bearer_token = req.headers.bear_token;
  req.body = { userId: test.userId, add: [ { id: 33 } ], remove: [] };
  return await postProcess( req, res );
};

app.route( '/test/process' ).post( testPostProcess );

app.use( '/test', router );
