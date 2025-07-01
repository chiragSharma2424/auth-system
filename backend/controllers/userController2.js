import userModel from "../models/user.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if(!user) {
            return res.json({
                success: false,
                message: "user not found"
            });
        }

        res.json({
            success: true,
            userData: {
                firstName: user.firstName,
                isAccountVerified: user.isAccountVerified
            }
        });
        
    } catch(err) {
        res.json({
            success: false,
            message: err.messages
        })
    }
}