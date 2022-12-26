import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.mjs";
import { Category } from "../../models/categoryModel.mjs";
import { SubCategory } from "../../models/subCategoryModel.mjs";

export const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Product price after discount must be less than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors must be an array of string"),
  check("imageCover").notEmpty().withMessage("Product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belongs to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (category === null) {
        throw new Error(`No category found for this id: ${categoryId}`);
      }
    }),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom(async (subCategoriesIds) => {
      const subCategories = await SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      });
      console.log(subCategories);
      if (
        subCategories.length < 1 ||
        subCategories.length !== subCategoriesIds.length
      ) {
        throw new Error("Invalid SubCategoriesIds");
      }
    })
    .custom(async (val, { req }) => {
      const subCategoriesInDB = await SubCategory.find({
        category: req.body.category,
      });
      const subCategoriesIdsInDB = subCategoriesInDB.map((subCategory) =>
        subCategory._id.toString()
      );
      if (!val.every((v) => subCategoriesIdsInDB.includes(v))) {
        throw new Error("SubCategories not belongs to this category");
      }
    }),
  check("brand").optional().isMongoId().withMessage("Invalid ID format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating average must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal to 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number"),
  validatorMiddleware,
];

export const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

export const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];
