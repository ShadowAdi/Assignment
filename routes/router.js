import express from "express";
import { FindUser, GetAuthenticatedUser, LoginAdmin, RegisterAdmin } from "../controllers/UserController.js";
import { authenticateAdmin } from "../middleware/Authentication.js";
import { ClaimCoupon, CreateCoupon, DeleteCoupons, GetAllCoupons, GetAllCoupons2 } from "../controllers/CouponController.js";

const router = express.Router()


router.post("/user/register", RegisterAdmin)
router.post("/user/login", LoginAdmin)
router.get("/user/:id", FindUser)
router.get("/user/authenticated", authenticateAdmin, GetAuthenticatedUser)


router.post("/coupon/create", authenticateAdmin, CreateCoupon)
router.get("/coupon/findAllCoupons",  GetAllCoupons)
router.get("/coupon/findCoupons",  GetAllCoupons2)
router.put("/coupon/claim", ClaimCoupon)
router.delete("/coupon/deleteCoupon/:id", authenticateAdmin, DeleteCoupons)



export default router