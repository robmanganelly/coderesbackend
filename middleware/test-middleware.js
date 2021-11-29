//todo delete this file and its implementation after testing

module.exports.testMiddleware = (label)=>{
    return (req, res, next)=>{
        console.log("\n\n\n  middleware passed: "+ label+" \n\n\n");
        next();
}
};