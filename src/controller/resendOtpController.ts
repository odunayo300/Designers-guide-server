import express,{Request, Response} from 'express'
const User = require('./../model/userSchema')
const bcrypt = require('bcrypt')
const generateOtp = require("../utils/otp")
const sendVerificationEmail = require("../services/email.service")

const resendOtp = async(req: Request, res: Response) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({message: "Email is required"});
    }
    try{
         const user = await User.findOne({email}).exec();

        if (!user) {
         return res.status(404).json({
            message: "User not found.",
        });

         return;
        }

        if(user.emailVerified){
            return res.status(404).json({
                message:"User already verified, Please proceed to log in"
            })
        }

          // Generate a new OTP
        const otp = generateOtp();

        // Hash OTP before storing it
        const otpHash = await bcrypt.hash(otp, 10);

        // Set expiration time (fifteen minutes)
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

         // Update user document
        user.otpCode = otpHash;
        user.otpCodeExpiration = otpExpires;

        // Reset attempts for the new OTP
        user.otpAttempts = 0;

        await user.save();

        // Send OTP to user's email
        await sendVerificationEmail(user.email, otp);

        res.status(200).json({
          message: "A new verification code has been sent to your email.",
        });

    }catch(err){
        console.error("Resend OTP error:", err);

        return res.status(500).json({message: "An error occurred while resending the OTP"})
    }
}

module.exports = resendOtp;