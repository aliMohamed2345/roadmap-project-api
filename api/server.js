import express from 'express'
import env from 'dotenv'

env.config()
const app = express();


const port = process.env.PORT || 3000

app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).json({ message: `Server is running` })
})

app.listen(port, () => { console.log(`Server is running on port ${port}`) })

export default app;