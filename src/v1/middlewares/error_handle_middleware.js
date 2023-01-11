function errorHandleMiddleware(app) {
    app.use((req, res, next) => {
        const error = new Error("Not Found url " + req.url);
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, next) => {
        res.status(error.status || 500).json({
            status: error.status || 500,
            errors: {
                message: error.message || "Internal Server Error",
            },
            elements: null,
        });
    });
}

module.exports = errorHandleMiddleware;