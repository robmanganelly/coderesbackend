module.exports.responseEnveloper = function(res, code, rawData,msg = ""){
    
    if (msg === ""){
        switch (true) {
            case (100<= code && code <=199):
                msg=`this is an info response, code: ${code}`;
                break;
            case (200<= code && code <=299):
                msg=`this is a success response, code: ${code}`;
                break;
            case (300<= code && code <=399):
                msg=`you will be redirected, code: ${code}`;
                break;
            case (400<= code && code <=499):
                msg=`this is a error response, code: ${code}`;
                break;
            default: 
                msg=`unknown internal error, code: ${code}`;
                break;
        }
    }


    const enveloped = {
        status: 299 >= code && code >= 200 ? "success": "error",
        data:{ data: rawData},
        message: msg
    }

    return res.status(code).json(enveloped);
}