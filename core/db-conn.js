const mongoose = require('mongoose');

const conn_string = process.env.NODE_ENV === 'production' ? 
// process.env.DB_CONN_STRING : 
`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_URL}/codetricksdb?retryWrites=true&w=majority`:
'mongodb://localhost:27017/codetricksdb';

mongoose.connect(
    conn_string, 
    { // important: if you clone this repo you must add your own connection string
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
        if (process.env.NODE_ENV === 'development') {
            console.log(`something went wrong while connecting to db: ${e.message}`);
            process.exit();
        }else{
            console.log('failed : exiting app');
            process.exit();
        }
    }
);

