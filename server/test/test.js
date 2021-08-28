const express = require( 'express' );

const { 
  session, 
} = require( '../config.json' );

const { 
  getUser, 
  getRoles, 
  getUsersRoles, 
  postProcess 
} = require( '../routeFunctions' );

const { 
  getNotionCategories, 
  getNotionRoles 
} = require( '../notion' );

const app = express();
app.use( require( 'express-session' )( session ) );
const router = express.Router();

const testNCats = async ( req, res ) => {
  req.session.bearer_token = req.query.token;
  return await getNotionCategories( req, res );
};
const testNRoles = async ( req, res ) => {
  req.session.bearer_token = req.query.token;
  return await getNotionRoles( req, res );
};

const testUser = async ( req, res ) => {
  req.session.bearer_token = req.query.token;
  return await getUser( req, res );
};

const testRoles = async ( req, res ) => {
  req.session.bearer_token = req.query.token;
  return await getRoles( req, res );
};

const testUsersRoles = async ( req, res ) => {
  req.session.bearer_token = req.query.token;
  return await getUsersRoles( req, res );
};

const testPostProcess = async ( req, res ) => {
  req.session.bearer_token = req.query.token;
  return await postProcess( req, res );
};

const api = express.Router();
const notion = express.Router();

notion.route( '/categories' ).get( testNCats );
notion.route( '/roles' ).get( testNRoles );

api.route( '/user' ).get( testUser );
api.route( '/roles' ).get( testRoles );
api.route( '/user-roles/:userId' ).get( testUsersRoles );
api.route( '/process' ).post( testPostProcess );

// @TODO path must route to firebase lambda - soon
// app.use( '/', ( req, res ) => res.sendFile( path.join( __dirname, '../index.html' ) ) );
// @TODO this will be done via rewriting in firebase i believe?
app.use( '/', routerWtf );
app.use( '/test', router );
app.use( '/test/api', api );
app.use( '/test/notion', notion );

module.exports = app;
