import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("database connected")
    }).catch((err) => {
        console.log("something went wrong", err);
    })
}