import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  addProductToCart,
  applyCouponToCart,
  clearLoggedUserCart,
  getLoggedUserCart,
  removeItemsFromCart,
  updateSpecificItemCartQuantity,
} from "../Services/cartService.mjs";

// eslint-disable-next-line import/prefer-default-export
export const cartRouter = express.Router();

cartRouter.use(protectRouteByToken, allowedTo("user"));
cartRouter.get("/", getLoggedUserCart);
cartRouter.post("/", addProductToCart);
cartRouter.put("/:itemId", removeItemsFromCart);
cartRouter.put("/change-quantity/:itemId", updateSpecificItemCartQuantity);
cartRouter.put("/coupon/apply", applyCouponToCart);
cartRouter.delete("/", clearLoggedUserCart);
