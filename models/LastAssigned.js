import mongoose from "mongoose";

const LastAssignedSchema = new mongoose.Schema({
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
});

export default mongoose.model("LastAssigned", LastAssignedSchema);