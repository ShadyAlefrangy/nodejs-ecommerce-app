import express from "express";
import { allowedTo, protectRouteByToken } from "../Services/authService.mjs";
import {
  checkoutSession,
  createCashOrder,
  getAllOrders,
  getOrdersForLoggedUser,
  getSpecifiedOrder,
  updateOrderStatusToPaid,
  updateOrderToDelivered,
} from "../Services/orderService.mjs";

// eslint-disable-next-line import/prefer-default-export
export const orderRouter = express.Router();
orderRouter.use(protectRouteByToken);
orderRouter.get(
  "/checkout-session/:cartId",
  allowedTo("user"),
  checkoutSession
);
orderRouter.get(
  "/",
  allowedTo("admin", "manager", "user"),
  getOrdersForLoggedUser,
  getAllOrders
);
orderRouter.get(
  "/:id",
  allowedTo("admin", "manager", "user"),
  getOrdersForLoggedUser,
  getSpecifiedOrder
);
orderRouter.post("/:cartId", allowedTo("user"), createCashOrder);
orderRouter.put("/:id/pay", allowedTo("admin"), updateOrderStatusToPaid);
orderRouter.put("/:id/deliver", allowedTo("admin"), updateOrderToDelivered);
