
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/user";



export async function GET(req, context) {

    await dbConnect();

    try {
        const user = await User.findOne({ activationToken: context.params.token });

         console.log("user",user)
        if (!user) {
            console.log("user111111111111" )
            return NextResponse.json({ err: 'Invalid activation token' }, { status: 500 });
        }

        user.isActive = true;
        user.activationToken = undefined;
        await user.save();
        console.log("userx", user)
        return NextResponse.json({ msg: 'Account activated successfully' }, { status: 200 });


    } catch (err) {

        console.log(err)
        return NextResponse.json({ err: 'Error activating account' }, { status: 500 });


    }
};
