function errorHandler(err, req, res, next) {
    if(err.name === 'UnauthorizedError'){
        //jwt authentication error
        return res.status(401).json({message: "The user is not authorized"})
    }

    if(err.name === 'ValidationError') {
        // Validation Error
        return res.status(401).json({message: "THe user is not authorized"})
    }

    //default 500 server error
    return res.status(500).json(err);
}

module.exports = errorHandler;