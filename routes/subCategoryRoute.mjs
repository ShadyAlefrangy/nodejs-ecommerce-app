/* eslint-disable import/prefer-default-export */
import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  createObjectFilter,
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategory,
  setCategoryId,
  updateSubCategory,
} from "../Services/subCategoryService.mjs";
import {
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} from "../util/validators/subCategoryValidator.mjs";

// mergeParams: allow us to access params on the other router
export const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter.post(
  "/",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  setCategoryId,
  createSubCategoryValidator,
  createSubCategory
);
subCategoryRouter.get("/", createObjectFilter, getSubCategories);
subCategoryRouter.get("/:id", getSubCategoryValidator, getSubCategory);
subCategoryRouter.put(
  "/:id",
  protectRouteByToken,
  allowedTo("admin", "manager"),
  updateSubCategoryValidator,
  updateSubCategory
);
subCategoryRouter.delete(
  "/:id",
  protectRouteByToken,
  allowedTo("admin"),
  deleteSubCategoryValidator,
  deleteSubCategory
);
