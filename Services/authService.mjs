/* eslint-disable import/prefer-default-export */
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.mjs";
import { ApiError } from "../util/apiError.mjs";
import { sendEmail } from "../util/sendEmail.mjs";
import { createToken } from "../util/createToken.mjs";

// @desc signup new user
// @route POST api/v1/auth/
// @access public
export const signup = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const token = createToken(user._id);

    res.status(201).json({ user: user, token: token });
  } catch (err) {
    next(err);
  }
};

// @desc login
// @route POST api/v1/auth/login
// @access public
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiError("Email or password is incorrect", 401));
    }
    const token = createToken(user._id);
    return res.status(200).json({ data: user, token });
  } catch (err) {
    next(err);
  }
};
// @desc make sure user is logged in
export const protectRouteByToken = async (req, res, next) => {
  try {
    // 1. check if token exist, if exist get it
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new ApiError("Please login to access this route", 401));
    }
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(
        new ApiError("User belongs to this token does not exist", 401)
      );
    }
    // 4. check if the user change password
    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      if (passwordChangedTimestamp > decoded.iat) {
        return next(
          new ApiError(
            "User recently changed his password, please login again.",
            401
          )
        );
      }
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const allowedTo =
  (...roles) =>
  async (req, res, next) => {
    try {
      // 1. access the roles
      // 2. access registered user (req.user)
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError("You are not allowed to access this route.", 403)
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };

// @desc forgetPassword
// @route POST api/v1/auth/forgetPassword
// @access public
export const forgetPassword = async (req, res, next) => {
  try {
    // 1. check if the user exists by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`No user found for this email: ${req.body.email}`, 404)
      );
    }
    // 2. If user exists, generate 6 random numbers and save it in DB
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");
    // save hashed reset code to DB with expired date
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpireDate = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();
    // 3. send the reset code to email
    try {
      await sendEmail({
        to: user.email,
        subject: "Your password reset code",
        body: `Hello ${user.name},\n Your reset code is ${resetCode} and this code is valid for 10 minutes.\n Thanks`,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpireDate = undefined;
      user.passwordResetVerified = undefined;
      await user.save();
      return next(
        new ApiError(
          "There an error occurred while sending the reset code",
          500
        )
      );
    }
    res.status(200).json({
      status: "Success",
      message: "Reset code sent successfully to your email",
    });
  } catch (err) {
    next(err);
  }
};
// @desc verifyResetCode
// @route POST api/v1/auth/verifyResetCode
// @access public
export const verifyResetCode = async (req, res, next) => {
  try {
    // 1. Get user based on reset code
    const hashedResetCode = crypto
      .createHash("sha256")
      .update(req.body.resetCode)
      .digest("hex");
    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpireDate: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ApiError("Reset code is invalid or expired"));
    }
    // 2. Reset code valid
    user.passwordResetVerified = true;
    await user.save();
    res.status(200).json({ status: "Success" });
  } catch (error) {
    next(error);
  }
};

// @desc reset password
// @route POST api/v1/auth/resetPassword
// @access public
export const resetPassword = async (req, res, next) => {
  try {
    // 1. Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`No user found for this email ${req.body.email}`, 404)
      );
    }
    // 2. check if reset code verified
    if (!user.passwordResetVerified) {
      return next(new ApiError(`Reset code not verified`, 400));
    }
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpireDate = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    // 3. if every thing is ok then generate new token
    const token = createToken(user._id);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
