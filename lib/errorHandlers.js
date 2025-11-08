// 404 handler middleware
export const notFoundHandler = (app) => {
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `Route ${req.method} ${req.originalUrl} not found`,
        });
    });
}

export const globalErrorHandler = (app) => {
    app.use((err, req, res, next) => {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    });
}