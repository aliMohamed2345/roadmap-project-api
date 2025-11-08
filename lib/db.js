import env from 'dotenv'
import mongoose from "mongoose";

env.config();

const connectToDB = async () => await mongoose.connect(process.env.CONNECTION_STR)
    .then(() => console.log(`Connected to DB Successfully `))
    .catch(error => {
        console.log(`error connecting to DB:${error}`)
        process.exit(1)
    })


export default connectToDB;
