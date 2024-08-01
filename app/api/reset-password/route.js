import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";
import bcrypt from "bcrypt";




export async function POST(req) {
    await dbConnect();
    const body = await req.json();
    const {  resetCode, newPassword } = body;
   

    try {
        
        const { newPassword, resetCode } = body;
        // Check if user with email exists
        const user = await User.findOne({
            "resetCode.data": resetCode,
            "resetCode.expiresAt": { $gt: new Date() },
        });
        if (!user) {
            return NextResponse.json(
                {
                    err: "Invalid or expired reset code",
                },
                { status: 400 }
            );
        }
        // Reset the user's password and save the updated user
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetCode = null; // Clear the reset code
        await user.save();
       

      

        return NextResponse.json({ msg: 'Password reset successful' });

       
    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err.message }, { status: 500 });

    }
}
