const mongoose = require('mongoose');

mongoose.connect(
    process.env.DB_CONN_STRING,{ // important: if you clone this repo you must add your own connection string
        useNewUrlParser: true,
    }// todo replace this console.log with proper logger service.
).then(
    () => {
        console.log("connected to mongodb");
    }
).catch(
    (e)=>{
        if (process.env.NODE_ENV === "development"){
            console.log(process.env.DB_CONN_STRING);
            console.log(e);
        }
        console.log("something went wrong while connecting to db");
    }
);