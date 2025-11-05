import express from 'express'
import env from 'dotenv'
import connectToDB from '../lib/db.js';
import authRoutes from './../routes/auth.routes.js'
import cookieParser from 'cookie-parser';
env.config()
const app = express();


const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/auth', authRoutes)

app.get('/', (req, res) => {
    res.status(200).json({ message: `Server is running` })
})

// 404 handler middleware
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// global error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: err.message,
    });
});

app.listen(port, () => { console.log(`Server is running on port ${port}`) })
connectToDB()

export default app;