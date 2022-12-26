import { Review } from "../models/reviewModel.mjs";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.mjs";

export function setProductIdAndUserId(req, res, next) {
  // nested routes
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }
  next();
}

export function createObjectFilter(req, res, next) {
  let filter = {};
  if (req.params.productId) {
    filter = { product: req.params.productId };
  }
  req.objectFilter = filter;
  next();
}
// @desc get list of reviews
// @route GET api/v1/reviews/
// @access public
export const getReviews = getAll(Review);

// @desc get specific Review by id
// @route GET api/v1/reviews/:id
// @access public
export const getReview = getOne(Review);

// @desc create new review
// @route POST api/v1/reviews/
// @access private/protect/user
export const createReview = createOne(Review);

// @desc update specific review by id
// @route PUT api/v1/reviews/:id
// @access private/protect/user
export const updateReview = updateOne(Review);

// @desc delete specific review by id
// @route DELETE api/v1/reviews/:id
// @access private/protect/user-admin-manager
export const deleteReview = deleteOne(Review);
