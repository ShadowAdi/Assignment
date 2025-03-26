import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true // Ensures each coupon is unique
    },
    status: {
        type: String,
        enum: ["available", "claimed"],
        default: "available"
    },
    claimedBy: {
        ip: { type: String }, // Stores user IP
        browserSession: { type: String }, // Stores browser session ID
        claimedAt: { type: Date } // Stores timestamp of claim
    }
});

export const Coupon = mongoose.model("Coupon", CouponSchema);
