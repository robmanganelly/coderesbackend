const dotenv = require("dotenv");
dotenv.config({ path: "./config.env"});
// all env variables must be stored there, if unwanted behavior experienced, check for this file to function properly

// todo require(logger) // above of all except env vars config

//todo : explore advantages of socket.io for this app, if so, include here...

const app = require("./app");

// todo require middleware here

const httpServer = require("http").createServer(app);

require('./db-conn'); // connect to the database 

//todo if socket-io used, place config here (after db connection)

const PORT = process.env.PORT || 3000;

httpServer.listen(+PORT , ()=> console.log(`running ${process.env.NODE_ENV} server on port ${PORT} ...`))

