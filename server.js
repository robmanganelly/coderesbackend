const dotenv = require("dotenv");
const express = require('express');
const cors = require("cors");

dotenv.config({ path: "./core/config.env"});

const errorHandler = require('./middleware/errorDispatcher');
// all env variables must be stored there, if unwanted behavior experienced, check for this file to function properly

// todo require(logger) // above of all except env vars config

//todo : explore advantages of socket.io for this app, if so, include here...

const app = require("./core/app");

// todo require middleware here // when middleware grows too much, take apart to single file

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: 'GET,POST,PATCH,DELETE'
}));
app.use(require("morgan")("dev"));
require('./middleware/routes')(app);
require('./core/db-conn'); // connect to the database 
app.use(errorHandler);



const httpServer = require("http").createServer(app);

//todo if socket-io used, place config here (after db connection)


const PORT = process.env.PORT || 3000;

httpServer.listen(+PORT , ()=> console.log(`running ${process.env.NODE_ENV} server on port ${PORT} ...`));



