import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  processImage,
  updateCategory,
  uploadCategoryImage,
} from "../Services/categoryService.mjs";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} from "../util/validators/categoryValidator.mjs";
import { subCategoryRouter } from "./subCategoryRoute.mjs";

// eslint-disable-next-line import/prefer-default-export
export const categoryRouter = express.Router();
// nested routes
categoryRouter.use("/:categoryId/subcategories", subCategoryRouter);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryValidator, getCategory);
categoryRouter.post(
  "/",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  uploadCategoryImage,
  processImage,
  createCategoryValidator,
  createCategory
);
categoryRouter.put(
  "/:id",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  uploadCategoryImage,
  processImage,
  updateCategoryValidator,
  updateCategory
);
categoryRouter.delete(
  "/:id",
  protectRouteByToken,
  allowedTo("admin"),
  deleteCategoryValidator,
  deleteCategory
);
