import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  createObjectFilter,
  createReview,
  deleteReview,
  getReview,
  getReviews,
  setProductIdAndUserId,
  updateReview,
} from "../Services/reviewService.mjs";
import {
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} from "../util/validators/reviewValidator.mjs";

// eslint-disable-next-line import/prefer-default-export
export const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.get("/", createObjectFilter, getReviews);
reviewRouter.get("/:id", protectRouteByToken, allowedTo("user"), getReview);
reviewRouter.post(
  "/",
  protectRouteByToken,
  allowedTo("user"),
  setProductIdAndUserId,
  createReviewValidator,
  createReview
);
reviewRouter.put(
  "/:id",
  protectRouteByToken,
  allowedTo("user"),
  updateReviewValidator,
  updateReview
);
reviewRouter.delete(
  "/:id",
  protectRouteByToken,
  allowedTo("admin", "manager", "user"),
  deleteReviewValidator,
  deleteReview
);
