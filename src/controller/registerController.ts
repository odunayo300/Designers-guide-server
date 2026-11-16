import express,{Request, Response} from 'express'
const User = require('./../model/userSchema')
const bcrypt = require('bcrypt')
const generateOtp = require("../utils/otp")
const sendVerificationEmail = require("../services/email.service")

const handleNewUser = async(req: Request, res: Response) => {
    const {brandName, email, password, confirmPassword, address} = req.body;

    // Input validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!brandName.trim()){
        return res.status(400).json({message: "Brand name is required"});
    }else if(!email.trim()){
        return res.status(400).json({message: "Email is required"});
    }else if(!emailRegex.test(email)){
        return res.status(400).json({message: "provide a valid email address"});
    }
    else if(!password.trim()){
        return res.status(400).json({message: "Password is required"});
    }else if(password.length < 8){
        return res.status(400).json({message: "Password must be at least 8 characters long"});
    }else if(password !== confirmPassword){
        return res.status(400).json({message: "Passwords do not match"});
    }

    // check for existingUser email

    const existingUser = await User.findOne({email}).exec();
    
    if(existingUser?.emailVerified){
        return res.status(400).json({message: "An account with this email already exists. Please proceed to log in."});
    }
    try{
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOtp(); // Generate OTP

        // store only the otp hash
        const hashedOTP = await bcrypt.hash(otp, 10);

        // set otp to expire in 15 minutes
        const otpExpiration = new Date(Date.now() + 15 * 60 * 1000);

        if(existingUser){
            // Update existing user with new details
            existingUser.brandName = brandName;
            existingUser.password = hashedPassword;
            existingUser.otpCode = hashedOTP;
            existingUser.otpCodeExpiration = otpExpiration;
            existingUser.address = address;
            await existingUser.save();
        }

        else{
            // create and store new user
            const newUser = await User.create({
                brandName,
                email,
                password: hashedPassword,
                otpCode: hashedOTP,
                otpCodeExpiration: otpExpiration,
                address
            });
            console.log('New user created:', newUser);
        }
        // send otp after saving and creating the users
        try{
            // send otp to email
            await sendVerificationEmail(email, otp);
        }catch(err){
            console.error('Error sending verification email:', err);
            return res.status(500).json({message: "Your account is awaiting email verification., but we cound not send the code, please request another code",
                email
            });
            
            return;
        }

        // sending the success response to client

        res.status(201).json({
            message:" Account created. Check your email for the verification code",
            email
        })

    }catch(error){
        // handle duplicate emails, including cuncurrent registration attempts.
        if( typeof error === "object" && error !== null && "code" in error && error.code === 11000){
            res.status(409).json({
                message: "An account with this email already exist"
            });

            return;
        }
        console.error("Registration error:", error );

        res.status(500).json({
            message:"Something went wrong during registration, try again"
        })
    }
}

module.exports = {handleNewUser}