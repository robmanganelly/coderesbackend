const path = require("path");

const languages = require('./../endpoints/code-lang/route');
const comments = require('./../endpoints/comments/route');
const problems  = require('./../endpoints/problems/route');
const solutions  = require('./../endpoints/solutions/route');

/*//todo place all routes here, following the template:
    const route_name = require('../../endpoints/route_name/route');

    and in the exports, inside function(application):

    application.use('/api/v1/route_address',route_name);

*/


module.exports = function(application){
    // application.use('/api/v1/route_address',route_name);
    application.use('/api/v1/languages', languages);
    application.use('/api/v1/comments', comments);
    application.use('/api/v1/problems',problems);
    application.use('/api/v1/solutions',solutions);

};

