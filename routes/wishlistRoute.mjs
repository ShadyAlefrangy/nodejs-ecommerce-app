import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  addProductToWishlist,
  getLoggedUserWishlist,
  removeProductFromWishlist,
} from "../Services/wishlistService.mjs";

// eslint-disable-next-line import/prefer-default-export
export const wishlistRouter = express.Router();
wishlistRouter.use(protectRouteByToken, allowedTo("user"));
wishlistRouter.get("/", getLoggedUserWishlist);
wishlistRouter.post("/", addProductToWishlist);
wishlistRouter.delete("/:productId", removeProductFromWishlist);
