
import mongoose from "mongoose";

//const db ="mongodb://127.0.0.1:27017/auth"
const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return
    }
    console.log("====>", process.env.DB_URI)
    await mongoose.connect(process.env.DB_URI)

}


export default dbConnect