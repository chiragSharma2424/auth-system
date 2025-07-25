import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import dotenv from 'dotenv';
import transporter from '../config/nodemailer.js';
dotenv.config();

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
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 
            'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        // sending welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'welcome to company',
            text: `welcome to our company. your account has been created with id ${email}`
        }

        await transporter.sendMail(mailOptions);

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



// login controller
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
            message: "user login successfully"
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



// verification of email id, otp wil sended 
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified) {
            res.json({
                success: false,
                message: "Account already verifed"
            });
        }

        // genrates 6 digit otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 *60 * 1000
        await user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            text: `your OTP is ${otp}. verify your account using this OTP`
        }

        await transporter.sendMail(mailOption);

        res.json({
            success: true,
            message: "verification otp is sended to email"
        })

    } catch(err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}



// verfiy the email using otp
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;
    if(!userId || !otp) {
        return res.json({
            success: false,
            message: "missing details"
        })
    }

    try {
        const user = await userModel.findById(userId);
        
        if(!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        if(user.verifyOtp === ' ' || user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: "invalid otp"
            })
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: 'OTP Expired'
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({
            success: true,
            message: "Email verified"
        });

    } catch(err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}



// check user is authenicated or not
// it will only check user is authenticted or not jab tak token 
// cookie me h tw user authenticated h

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
        })
    } catch(err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}




// send password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if(!email) {
        return res.json({
            success: false,
            message: "email is required"
        })
    }

    try {
        const user = userModel.findOne({email});
        if(!user) {
            return res.json({
                success: false,
                message: "user will not found"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
            text: `Your otp for resetting your password is ${otp} use
            thi OTP to proceed with resetting your password`
        }
        await transporter.sendMail(mailOption);

        return res.json({
            success: true,
            message: "OTP sent to your email"
        });

    } catch(err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}




// Reset user password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    
    if(!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: "email, otp and new password is reqired"
        })
    }

    try {
        const user = await userModel.findOne({email});
        if(!user) {
            res.json({
                success: false,
                message: "user not found"
            })
        }

        if(user.resetOtp === ' ' || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "invalid otp"
            })
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "otp is expired"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = ' ';
        user.resetOtpExpireAt = 0;
        await new user.save(); 

        return res.json({
            success: true,
            message: "password has been reset successfully"
        });


    } catch(err) {
        res.json({
            success: false,
            message: err.message
        })
    }
}