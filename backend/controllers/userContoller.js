import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import dotenv from 'dotenv'

export const register = async (req, res) => {
    const {firstName, email, password} = req.body;
    if(!firstName || !email || !password) {
        return res.json({
            success: false,
            message: "all fields are required"
        });
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            res.json({
                success: false,
                message: "user already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            firstName,
            email,
            password: hashedPassword
        });

        await user.save();

        // generate a token using jwt
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expires: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "user register successfully"
        })

    } catch(err) {
        console.log(err);
        res.json({
            success: false,
            message: "internal server error"
        })
    }
}



export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.json({
            success: false,
            message: "email and password are required"
        });
    }

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({
                success: false,
                message: "invalid email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({
                success: false,
                message: "invalid password"
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "user login"
        })
    } catch(err) {
        console.log(err);
        return res.json({
            success: false,
            message: err.message
        })
    }
}




// logout controller
export const logout = async (req, res) => {
    try {
       res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none': 'strict',
       });

       return res.json({
        success: true,
        message: "logut successfully"
       });
       
    } catch(err) {
         return res.json({
            success: false,
            message: err.message
        })
    }
}