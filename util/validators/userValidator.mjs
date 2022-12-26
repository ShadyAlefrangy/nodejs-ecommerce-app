import { check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.mjs";
import { User } from "../../models/userModel.mjs";

export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("Name too short")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("Email already in use");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirmation) {
        throw new Error("Password confirmation is incorrect");
      }
      return true;
    }),

  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required"),

  check("phone")
    .optional()
    .isMobilePhone("ar-PS")
    .withMessage("Invalid phone number only accepts palestine phone numbers"),

  check("profileImage").optional(),
  check("role").optional(),

  validatorMiddleware,
];

export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-PS")
    .withMessage("Invalid phone number only accepts palestine phone numbers"),

  check("profileImage").optional(),
  check("role").optional(),
  validatorMiddleware,
];

export const changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(async (val, { req }) => {
      // 1. verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      // 2. verify password confirmation
      if (val !== req.body.passwordConfirmation) {
        throw new Error("Password confirmation is incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

export const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

export const updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-PS")
    .withMessage("Invalid phone number only accepts palestine phone numbers"),
  validatorMiddleware,
];
