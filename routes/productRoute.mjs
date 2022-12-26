import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  processProductImage,
  updateProduct,
  uploadProductImage,
} from "../Services/productService.mjs";
import {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} from "../util/validators/productValidator.mjs";
import { reviewRouter } from "./reviewRoute.mjs";

// eslint-disable-next-line import/prefer-default-export
export const productRouter = express.Router();
// nested routes
productRouter.use("/:productId/reviews", reviewRouter);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductValidator, getProduct);
productRouter.post(
  "/",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  uploadProductImage,
  processProductImage,
  createProductValidator,
  createProduct
);
productRouter.put(
  "/:id",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  uploadProductImage,
  processProductImage,
  updateProductValidator,
  updateProduct
);
productRouter.delete(
  "/:id",
  protectRouteByToken,
  allowedTo("admin"),
  deleteProductValidator,
  deleteProduct
);
