import express from "express";
import {
  addAddress,
  getLoggedUserAddresses,
  removeAddress,
} from "../Services/addressService.mjs";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";

// eslint-disable-next-line import/prefer-default-export
export const addressRouter = express.Router();
addressRouter.use(protectRouteByToken, allowedTo("user"));
addressRouter.get("/", getLoggedUserAddresses);
addressRouter.post("/", addAddress);
addressRouter.delete("/:addressId", removeAddress);
