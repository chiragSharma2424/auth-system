import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ' '},
    verifyOtpExpireAt: {type: Number, default: 0},
    isVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ' '},
    resetOtpExpireAt: {type: Number, default: 0}
}, {timestamps: true});

const userModel = mongoose.model('user', userSchema);
export default userModel;