import { NextResponse } from "next/server";


import dbConnect from "@/utils/dbConnect";

import User from "@/models/user";
import bcrypt from "bcrypt";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";


export async function POST(req) {

    await dbConnect()


    const session = await getServerSession(authOptions);
    // Parse the incoming request body
    const { name, email, password, profileImage } = await req.json();

    try {



        if (!session?.user?._id) {
            return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
        }



        // Find the user by ID and update their record
        let updatedUser = await User.findByIdAndUpdate(
            session.user._id,
            {
                name,
                email,
                password: await bcrypt.hash(password, 10), // Ensure you hash the password before saving if you're handling passwords
                profileImage
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return NextResponse.json({ err: "User not found" }, { status: 404 });
        }

        console.log(updatedUser)
        return NextResponse.json({ msg: "User updated successfully", user: updatedUser }, { status: 200 });








    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: err.message }, { status: 500 })



    }








}







export async function GET(req) {

    await dbConnect()


    const session = await getServerSession(authOptions);

    try {



        if (!session?.user?._id) {
            return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
        }



        const user = await User.findOne({ _id: session?.user?._id })

        console.log(user)

        return NextResponse.json(user);








    } catch (err) {
        console.log(err)
        return NextResponse.json({ err: err.message }, { status: 500 })



    }








}






