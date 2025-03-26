import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate emails
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin"], // Only allow "admin" role
        default: "admin"
    }
});

export const User = mongoose.model("User", UserSchema);
