import { Coupon } from "../models/couponModel.mjs";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.mjs";

// @desc get list of coupons
// @route GET api/v1/coupons/
// @access private/Admin-Manager
export const getCoupons = getAll(Coupon);

// @desc get specific coupon by id
// @route GET api/v1/coupons/:id
// @access private/Admin-Manager
export const getCoupon = getOne(Coupon);

// @desc create new coupon
// @route POST api/v1/coupons/
// @access private/Admin-Manager
export const createCoupon = createOne(Coupon);

// @desc update specific coupon by id
// @route PUT api/v1/coupons/:id
// @access private/Admin-Manager
export const updateCoupon = updateOne(Coupon);

// @desc delete specific coupon by id
// @route DELETE api/v1/coupons/:id
// @access private/Admin-Manager
export const deleteCoupon = deleteOne(Coupon);
