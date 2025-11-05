import env from 'dotenv'
import mongoose from "mongoose";

env.config();

const connectToDB = () => mongoose.connect(process.env.CONNECTION_STR)
    .then(console.log(`Connected to DB Successfully `))
    .catch(error => console.log(`error connecting to DB:${error}`))


export default connectToDB;
