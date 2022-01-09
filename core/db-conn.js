const mongoose = require('mongoose');

const conn_string  = process.env.NODE_ENV === "production" ? 
`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.db_CLUSTER_URL}/codetricksdb?retryWrites=true&w=majority`:
'mongodb://localhost:27017/codetricksdb' 

console.log(conn_string);

mongoose.connect( conn_string,
    // process.env.DB_CONN_STRING  // this was replaced 
    {
            useNewUrlParser: true,
    }// todo replace this console.log with proper logger service.
).then(
    () => {
        console.log(
            process.env.NODE_ENV === 'production'?
            "connected to Cluster": "connected to mongo:localhost"
        );
    }
).catch(
    (e)=>{
        
        console.log("something went wrong while connecting to db");
    }
);