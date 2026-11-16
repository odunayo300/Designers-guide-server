import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const  sendVerificationEmail = async (email: string, otp: string) => {
    const {data, error} =  await resend.emails.send({
        from: "Designers Guide <onboarding@resend.dev>",
        to: email,
        subject: "Verify your designers guide account",
        // HTML is the content the user sees in their email.  
        html: `  
        <div style="font-family: Arial, sans-serif;">  
            <h2>Welcome to Designers Guide!</h2>  

            <p>Use the verification code below to verify your email.</p>  

            <h1 style="letter-spacing: 5px;">${otp}</h1>  

            <p>This code expires in 15 minutes.</p>  

            <p>If you did not request this code, you can ignore this email.</p>  
        </div>  
        `,  
    })

    if(error){
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
    console.log({data});
}

module.exports = sendVerificationEmail;