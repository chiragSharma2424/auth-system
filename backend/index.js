import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());

// api endpoints
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send("api working");
})

app.listen(port, () => {
    console.log(`server started on ${port}`);
});