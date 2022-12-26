import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
} from "../Services/couponService.mjs";

// eslint-disable-next-line import/prefer-default-export
export const couponRouter = express.Router();
couponRouter.use(protectRouteByToken, allowedTo("admin", "manager"));
couponRouter.get("/", getCoupons);
couponRouter.get("/:id", getCoupon);
couponRouter.post("/", createCoupon);
couponRouter.put("/:id", updateCoupon);
couponRouter.delete("/:id", deleteCoupon);
