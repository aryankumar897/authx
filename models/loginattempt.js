import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
    email: { type: String, required: true },
    attempts: { type: Number, required: true, default: 0 },
    lastAttempt: { type: Date, default: Date.now },
    blockedUntil: { type: Date, default: null },
});

export default mongoose.models.LoginAttempt || mongoose.model("LoginAttempt", loginAttemptSchema);
