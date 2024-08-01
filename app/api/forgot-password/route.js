import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";

import nodemailer from "nodemailer";



function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000);
}


const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'akumar07092000@gmail.com',
        pass: 'attluekcguytkklb',
    },
});


export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const { email } = body;
    console.log({ email });

    try {

        const resetCode = generateVerificationCode();

        // Save verification code to user document in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' });
        }


        // Save reset code in the user db
        user.resetCode = {
            data: resetCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes in
          
        };
        await user.save();



      

       
        const resetLink = `http://localhost:3000/reset-password?email=${email}&code=${resetCode}`;


        const mailOptions = {
            to: email, // mail receiver email
            from: 'akumar07092000@gmail.com', // mail sending service provider

            subject: "Password Reset Request",
            html: `


  <div style="font-family: Arial, sans-serif; background-color: blue; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333333; text-align: center;">Password Reset Request</h2>
                    <p style="color: blue;">Hello,  your  code ${resetCode} </p>
                    <p style="color: #555555;">You requested a password reset. Click the button below to reset your password:  valid  for  only 10 min</p>
                    <p style="text-align: center;">
                        <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </p>
                    <p style="color: #555555;">If you did not request this, please ignore this email.</p>
                    <p style="color: #555555;">Regards,<br>Your Company</p>
                </div>
            </div>



 `,
        };



        await transporter.sendMail(mailOptions);


      


        return NextResponse.json({ msg: 'Password reset link sent successfully' });


    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err.message }, { status: 500 });

    }
}
