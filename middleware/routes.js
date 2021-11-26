const path = require("path");

const languages = require('./../endpoints/code-lang/route');

/*//todo place all routes here, following the template:
    const route_name = require('../../endpoints/route_name/route');

    and in the exports, inside function(application):

    application.use('/api/v1/route_address',route_name);

*/


module.exports = function(application){
    // application.use('/api/v1/route_address',route_name);
    application.use('/api/v1/languages', languages);
};
