import express,{Request, Response} from 'express'
const User = require('../model/userSchema')
const bcrypt = require('bcrypt')

const verifyEmail = async (req: Request, res: Response) => {
    const {email, otp} = req.body;

    if(!email){
        return res.status(400).json({message: "Email is required"})
    }else if(!otp){
        return res.status(400).json({message: "OTP is required"})
    }

    try{
        const user = await User.findOne({email,
            emailVerified: false
        }).select('+otpCode +otpCodeExpiration +otpAttempts');

        if(!user){
            return res.status(400).json({message: "No unverified account found with this email"})
        }

        if(user.otpAttempts >= 5){
            return res.status(400).json({message: "Maximum OTP attempts exceeded. Please request a new OTP."})

            return;
        }

        if( user.otpCodeExpiration <= new Date()){
            return res.status(400).json({
                message:" Otp as expired, please request a new one"
            })

            return;
        }

         // evaluate otp code 
          const match = await bcrypt.compare(otp, user.otpCode);

        if(match){
            user.emailVerified = true; 
            user.otpCode = undefined;
            user.otpCodeExpiration = undefined;
            user.otpAttempts =  0;

            await user.save();

            return res.status(200).json({
                message: "Email verified successfully. You can now log in."
            })
        }else{
            user.otpAttempts += 1;

            await user.save();

            res.status(400).json({
                message : "Invalid otp code"
            })
        }

    } catch(err){
        return res.status(500).json({message: "An error occurred while verifying the email"})
    }

}

module.exports = verifyEmail;