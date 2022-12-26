import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../models/productModel.mjs";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./handlerFactory.mjs";
import { uploadMultipleImages } from "../middlewares/uploadImageMiddleware.mjs";

export const processProductImage = async (req, res, next) => {
  try {
    // 1. process image cover for product
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);
      req.body.imageCover = imageCoverFileName;
    }
    // 2. process product images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);
          req.body.images.push(imageName);
        })
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const uploadProductImage = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// @desc get list of products
// @route GET api/v1/products/
// @access public
export const getProducts = getAll(Product, "Product");

// @desc get specific product by id
// @route GET api/v1/products/:id
// @access public
export const getProduct = getOne(Product, "reviews");

// @desc create new product
// @route POST api/v1/products/
// @access private
export const createProduct = createOne(Product);

// @desc update specific product by id
// @route PUT api/v1/products/:id
// @access private
export const updateProduct = updateOne(Product);

// @desc delete specific product by id
// @route DELETE api/v1/products/:id
// @access private
export const deleteProduct = deleteOne(Product);
