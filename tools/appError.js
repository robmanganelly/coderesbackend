module.exports = class AppError extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status="internal unknown error";

        switch (statusCode) {
            case 400:
                this.status = "bad request"
                break;
            case 401:
                this.status = "not authorized"
                break;
            case 403:
                this.status = "forbidden!"
                break;
            case 404:
                this.status = "not found"
                break;
            default:
                break;
        }
        this.sourceError = "appError";
        this.isOperational = true;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
};
