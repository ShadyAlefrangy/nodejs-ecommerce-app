import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
  processImage,
  updateBrand,
  uploadBrandImage,
} from "../Services/brandService.mjs";
import {
  createBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} from "../util/validators/brandValidator.mjs";

// eslint-disable-next-line import/prefer-default-export
export const brandRouter = express.Router();

brandRouter.get("/", getBrands);
brandRouter.get("/:id", getBrandValidator, getBrand);
brandRouter.post(
  "/",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  uploadBrandImage,
  processImage,
  createBrandValidator,
  createBrand
);
brandRouter.put(
  "/:id",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  uploadBrandImage,
  processImage,
  updateBrandValidator,
  updateBrand
);
brandRouter.delete(
  "/:id",
  protectRouteByToken,
  allowedTo("admin"),
  deleteBrandValidator,
  deleteBrand
);
