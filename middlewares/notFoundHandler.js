const { StatusCodes } = require('http-status-codes');
const notFoundHandler = (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Error 404: Not Found.Sorry, the resource you are looking for is unavailable.'
    });
};

module.exports = notFoundHandler;