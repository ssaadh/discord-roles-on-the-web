const app = require( './app' );

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = ( process.env.NODE_ENV == 'development' ) ? 3001 : 3000;

app.listen( port, () => console.log( `Local app listening on port ${ port }!` ) );
