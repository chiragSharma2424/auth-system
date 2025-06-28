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
        const token = jwt.sign()

    } catch(err) {
        console.log(err);
        res.json({
            success: false,
            message: "internal server error"
        })
    }
}