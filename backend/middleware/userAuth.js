import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const userAuth = async (req, res) => {
    const { token } = req.cookies;

    if(!token) {
        return res.json({
            success: false,
            message: "Not auhtorized login again"
        })
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch(err) {

    }
}