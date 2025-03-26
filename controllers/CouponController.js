import { Coupon } from "../models/Coupon.js";
import LastAssigned from "../models/LastAssigned.js";
import { User } from "../models/User.js";

export const CreateCoupon = async (req, res) => {
    try {
        const { code } = req.body

        if (!code) {
            return res.status(400).json({
                message: "Coupon Code is required",
                success: false
            });
        }

        const userId = req.admin?.id;
        const userRole = req.admin?.role;


        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user ID found"
            });
        }

        if (!userRole && userRole !== "admin") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User is not admin"
            });
        }

        const foundUser = await User.findById(userId).select("-password");
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const createCoupon = await Coupon({
            code: code
        })
        await createCoupon.save()

        return res.status(201).json({
            message: "Coupon Created",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const GetAllCoupons = async (req, res) => {
    try {
        const avaiableCoupons = await Coupon.find({ status: "available" })
        return res.status(200).json({
            success: true,
            message: "Available coupons fetched successfully",
            coupons: avaiableCoupons
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const GetAllCoupons2 = async (req, res) => {
    try {
        const avaiableCoupons = await Coupon.find()
        return res.status(200).json({
            success: true,
            message: "Available coupons fetched successfully",
            coupons: avaiableCoupons
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};



export const DeleteCoupons = async (req, res) => {
    try {
        const couponId = req.params.id;

        if (!couponId) {
            return res.status(400).json({
                message: "Coupon ID is required",
                success: false
            });
        }

        const userId = req.admin?.id;
        const userRole = req.admin?.role;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user ID found"
            });
        }

        if (userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only admin can delete coupons"
            });
        }

        const couponExists = await Coupon.findById(couponId);
        if (!couponExists) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        // Delete associated records in LastAssigned
        await LastAssigned.deleteMany({ couponId });

        // Delete the coupon
        await Coupon.deleteOne({ _id: couponId });

        return res.status(200).json({
            message: "Coupon and associated records deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


export const ClaimCoupon = async (req, res) => {
    try {
        const userIP = req.ip;
        const userBrowser = req.headers['user-agent'];

        const availableCoupons = await Coupon.find({ status: "available" }).sort({ _id: 1 });

        if (availableCoupons.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No available coupons"
            });
        }

        let lastAssigned = await LastAssigned.findOne()

        let nextCouponIndex = 0

        if (lastAssigned) {
            const lastIndex = availableCoupons.findIndex(coupon => coupon._id.equals(lastAssigned.couponId))
            nextCouponIndex = (lastIndex + 1) % availableCoupons.length
        } else {
            lastAssigned = new LastAssigned({ couponId: availableCoupons[nextCouponIndex]._id });
            await lastAssigned.save();
        }

        const nextCoupon = availableCoupons[nextCouponIndex];

        lastAssigned.couponId = nextCoupon._id;
        await lastAssigned.save();

        nextCoupon.status = "claimed";
        nextCoupon.claimedBy = {
            ip: userIP,
            browserSession: userBrowser,
            claimedAt: new Date(),
        };

        await nextCoupon.save();

        return res.status(200).json({
            success: true,
            message: "Coupon claimed successfully",
            coupon: nextCoupon,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
