import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.mjs";
import { Brand } from "../models/brandModel.mjs";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.mjs";

export const processImage = async (req, res, next) => {
  try {
    const fileName = `brand-${uuidv4()}-${Date.now()}-.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);
    req.body.image = fileName;
    next();
  } catch (err) {
    next(err);
  }
};
export const uploadBrandImage = uploadSingleImage("image");
// @desc get list of brands
// @route GET api/v1/brands/
// @access public
export const getBrands = getAll(Brand);

// @desc get specific brand by id
// @route GET api/v1/brands/:id
// @access public
export const getBrand = getOne(Brand);

// @desc create new brand
// @route POST api/v1/brands/
// @access private
export const createBrand = createOne(Brand);

// @desc update specific brand by id
// @route PUT api/v1/brands/:id
// @access private
export const updateBrand = updateOne(Brand);

// @desc delete specific brand by id
// @route DELETE api/v1/brands/:id
// @access private
export const deleteBrand = deleteOne(Brand);
