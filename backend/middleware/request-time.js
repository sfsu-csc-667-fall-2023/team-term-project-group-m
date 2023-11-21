const requestTime = (request, response, next) => {
    console.log(
        `Request receives at ${Date.now()}: ${request.method}`
    );
    next();
};

module.exports = requestTime;