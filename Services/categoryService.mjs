import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.mjs";
import { Category } from "../models/categoryModel.mjs";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.mjs";

export const processImage = async (req, res, next) => {
  try {
    const fileName = `category-${uuidv4()}-${Date.now()}-.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${fileName}`);
      req.body.image = fileName;
    }
    next();
  } catch (err) {
    next(err);
  }
};
export const uploadCategoryImage = uploadSingleImage("image");
// @desc get list of categories
// @route GET api/v1/categories/
// @access public
export const getCategories = getAll(Category);

// @desc get specific category by id
// @route GET api/v1/categories/:id
// @access public
export const getCategory = getOne(Category);

// @desc create new category
// @route POST api/v1/categories/
// @access private
export const createCategory = createOne(Category);

// @desc update specific category by id
// @route PUT api/v1/categories/:id
// @access private
export const updateCategory = updateOne(Category);

// @desc delete specific category by id
// @route DELETE api/v1/categories/:id
// @access private
export const deleteCategory = deleteOne(Category);
