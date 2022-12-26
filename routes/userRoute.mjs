import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  changeUserPassword,
  createUser,
  deleteLoggedUserData,
  deleteUser,
  getLoggedUserDate,
  getUser,
  getUsers,
  processImage,
  updateLoggedUserData,
  updateLoggedUserPassword,
  updateUser,
  uploadUserImage,
} from "../Services/userService.mjs";
import {
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateLoggedUserValidator,
  updateUserValidator,
} from "../util/validators/userValidator.mjs";

// eslint-disable-next-line import/prefer-default-export
export const UserRouter = express.Router();

UserRouter.use(protectRouteByToken);

UserRouter.get("/user", getLoggedUserDate, getUser);
UserRouter.put(
  "/changeMyPassword",
  changeUserPasswordValidator,
  updateLoggedUserPassword
);
UserRouter.put(
  "/updateLoggedUserData",
  updateLoggedUserValidator,
  updateLoggedUserData
);
UserRouter.delete("/deleteMe", deleteLoggedUserData);
UserRouter.use(protectRouteByToken, allowedTo("admin", "manager"));

UserRouter.get("/", getUsers);
UserRouter.get("/:id", getUserValidator, getUser);
UserRouter.post(
  "/",
  uploadUserImage,
  processImage,
  createUserValidator,
  createUser
);
UserRouter.put(
  "/:id",
  uploadUserImage,
  processImage,
  updateUserValidator,
  updateUser
);
UserRouter.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
UserRouter.delete("/:id", deleteUserValidator, deleteUser);
