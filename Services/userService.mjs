import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.mjs";
import { User } from "../models/userModel.mjs";
import { ApiError } from "../util/apiError.mjs";
import { createOne, deleteOne, getAll, getOne } from "./handlerFactory.mjs";
import { createToken } from "../util/createToken.mjs";

export const processImage = async (req, res, next) => {
  try {
    const fileName = `user-${uuidv4()}-${Date.now()}-.jpeg`;
    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/users/${fileName}`);
      req.body.profileImage = fileName;
    }
    next();
  } catch (err) {
    next(err);
  }
};
export const uploadUserImage = uploadSingleImage("profileImage");
// @desc get list of users
// @route GET api/v1/users/
// @access private
export const getUsers = getAll(User);

// @desc get specific user by id
// @route GET api/v1/users/:id
// @access private
export const getUser = getOne(User);

// @desc create new user
// @route POST api/v1/users/
// @access private
export const createUser = createOne(User);

// @desc update specific user by id
// @route PUT api/v1/users/:id
// @access private
export const updateUser = async (req, res, next) => {
  try {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        slug: req.body.slug,
        profileImage: req.body.profileImage,
        role: req.body.role,
      },
      {
        new: true,
      }
    );

    if (!document) {
      return next(
        new ApiError(`No document found for this ${req.params.id}`, 404)
      );
    }
    res
      .status(200)
      .json({ message: "Document updated successfully", data: document });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc change user password by id
// @route PUT api/v1/users/:id
// @access private
export const changeUserPassword = async (req, res, next) => {
  try {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );

    if (!document) {
      return next(
        new ApiError(`No document found for this ${req.params.id}`, 404)
      );
    }
    res
      .status(200)
      .json({ message: "Password changed successfully", data: document });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc delete specific user by id
// @route DELETE api/v1/users/:id
// @access private
export const deleteUser = deleteOne(User);

// @desc get logged user data
// @route GET api/v1/users/
// @access private
export const getLoggedUserDate = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// @desc update logged user password
// @route PUT api/v1/users/changeMyPassword
// @access private
export const updateLoggedUserPassword = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError(`No user found for this ${req.params.id}`, 404));
    }
    const token = createToken(user._id);
    res
      .status(200)
      .json({ message: "Password changed successfully", data: user, token });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc update logged user data without (password)
// @route PUT api/v1/users/updateLoggedUserData
// @access private
export const updateLoggedUserData = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError(`No user found for this ${req.user._id}`, 404));
    }
    res.status(200).json({ message: "user updated successfully", data: user });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc deactivate logged user
// @route Delete api/v1/users/updateLoggedUserData
// @access private
export const deleteLoggedUserData = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { active: false },
      { new: true }
    );
    res.status(204).json({ message: "User has been deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
};
