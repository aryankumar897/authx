import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {

        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20

    },
    email: {

        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,

        lowercase: true,
    },



    password: {

        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    activationToken: {
        type: String,
    },

    loginTimes: { type: [Date], default: [] },

    role: {


        type: String,
        enum: [ 'user', 'admin'],

        default: "user",
        required: 'true'

    },
    resetCode: {
        data: String,
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 10 * 60 * 1000), // 10
           // minutes in milliseconds
        },
    },






}, { timestamps: true })



export default mongoose.models.User || mongoose.model("User", UserSchema)