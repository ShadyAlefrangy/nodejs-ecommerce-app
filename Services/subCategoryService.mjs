import { SubCategory } from "../models/subCategoryModel.mjs";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.mjs";

// middleware to set categoryId
export function setCategoryId(req, res, next) {
  // nested routes
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
    next();
  }
  next();
}

// middleware to set object filtering for get subcategories route
export function createObjectFilter(req, res, next) {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  req.objectFilter = filter;
  next();
}
// @desc create new SubCategory
// @route POST api/v1/subcategories/
// @access private
// eslint-disable-next-line import/prefer-default-export
export const createSubCategory = createOne(SubCategory);

// Get api/v1/categories/:categoryId/subcategories

// @desc get list of SubCategories
// @route GET api/v1/subcategories/
// @access public
export const getSubCategories = getAll(SubCategory);

// @desc get specific SubCategory by id
// @route GET api/v1/subcategories/:id
// @access public
export const getSubCategory = getOne(SubCategory);

// @desc update specific subCategory by id
// @route PUT api/v1/subcategories/:id
// @access private
export const updateSubCategory = updateOne(SubCategory);

// @desc delete specific subCategory by id
// @route DELETE api/v1/subcategories/:id
// @access private
export const deleteSubCategory = deleteOne(SubCategory);
