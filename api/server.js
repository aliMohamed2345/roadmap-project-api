import express from 'express'
import env from 'dotenv'
import cookieParser from 'cookie-parser';

//library
import connectToDB from '../lib/db.js';

//routes
import authRoutes from './../routes/auth.routes.js'
import usersRoutes from './../routes/users.routes.js'
import quizRoutes from './../routes/quiz.routes.js'

//error handler 
import { globalErrorHandler, notFoundHandler, } from '../lib/errorHandlers.js';

env.config()

const app = express();

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/quiz', quizRoutes)

app.get('/', (req, res) => {
    res.status(200).json({ message: `Server is running` })
})
 
notFoundHandler(app)

globalErrorHandler(app)
connectToDB()
app.listen(port, () => { console.log(`Server is running on port ${port}`) })

export default app;