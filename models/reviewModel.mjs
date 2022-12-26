/* eslint-disable import/prefer-default-export */
import mongoose from "mongoose";
import { Product } from "./productModel.mjs";

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "Rating reviews required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belongs to user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belongs to product"],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});
reviewSchema.statics.getAvgRatingsAndQuantity = async function (productId) {
  const results = await this.aggregate([
    // get all reviews on specified product
    { $match: { product: productId } },
    // calculate average rating and quantity
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (results.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: results[0].avgRating,
      ratingsQuantity: results[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.getAvgRatingsAndQuantity(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.getAvgRatingsAndQuantity(this.product);
});

export const Review = mongoose.model("Review", reviewSchema, "reviews");
