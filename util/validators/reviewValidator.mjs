import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.mjs";
import { Review } from "../../models/reviewModel.mjs";

export const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

export const createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings is required")
    .isFloat({ min: 1.0, max: 5.0 })
    .withMessage("Ratings must be between 1.0 and 5.0"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (val, { req }) => {
      // check if logged user create review for this product before
      const review = await Review.findOne({ user: req.user._id, product: val });
      if (review) {
        return Promise.reject(
          new Error("You already have created a review for this product before")
        );
      }
    }),
  validatorMiddleware,
];

export const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(new Error("No review found"));
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error("You are not allowed to perform this action")
        );
      }
    }),
  validatorMiddleware,
];

export const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (req.user.role === "user") {
        if (!review) {
          return Promise.reject(new Error("No review found"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      }
      return true;
    }),
  validatorMiddleware,
];
