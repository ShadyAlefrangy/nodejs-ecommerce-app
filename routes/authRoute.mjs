import express from "express";
import {
  forgetPassword,
  login,
  resetPassword,
  signup,
  verifyResetCode,
} from "../Services/authService.mjs";
import {
  forgetPasswordValidator,
  loginValidator,
  signUpValidator,
} from "../util/validators/authValidator.mjs";

// eslint-disable-next-line import/prefer-default-export
export const AuthRouter = express.Router();
AuthRouter.post("/signup", signUpValidator, signup);
AuthRouter.post("/login", loginValidator, login);
AuthRouter.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
AuthRouter.post("/verifyResetCode", verifyResetCode);
AuthRouter.put("/resetPassword", resetPassword);
