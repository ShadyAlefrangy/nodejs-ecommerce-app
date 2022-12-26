import Stripe from "stripe";
import { Cart } from "../models/cartModel.mjs";
import { Order } from "../models/orderModel.mjs";
import { Product } from "../models/productModel.mjs";
import { ApiError } from "../util/apiError.mjs";
import { getAll, getOne } from "./handlerFactory.mjs";
/* eslint-disable import/prefer-default-export */

// middleware to get logged users orders

const stripe = new Stripe(
  "sk_test_51LRYqYFIFQeo11lsKW6cElnX5sFPUPfOlcXSQQFKEsItg1Kcm2kfHnO45kEyszGbrs4dy7QyhjzL6YDpUm0VZ1Ik00B6NPxE4H"
);
export const getOrdersForLoggedUser = (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
};
// @desc create new cash order
// @route POST api/v1/orders/cartId
// @access private/User
export const createCashOrder = async (req, res, next) => {
  try {
    const taxPrice = 0;
    const shippingPrice = 0;
    // 1) get cart based on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiError("No cart found for this user", 404));
    }
    // 2) get total price cart based on cart (check if coupon is applied)
    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    // 3) create order with default payment method cash
    const order = await Order.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress: req.body.shippingAddress,
      totalOrderPrice,
    });
    // 4) after creating order, decrement product quantity, increment product sold
    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      }));
      await Product.bulkWrite(bulkOption, {});
      // 5) clear user cart based on cartId
      await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({ status: "success", data: order });
  } catch (error) {
    res.status(400).json(error);
  }
};

// @desc get all orders
// @route Get api/v1/orders/
// @access private/User-Admin-Manager
export const getAllOrders = getAll(Order);

// @desc get specified order
// @route Get api/v1/orders/:id
// @access private/User-Admin-Manager
export const getSpecifiedOrder = getOne(Order);

// @desc update order paid status to paid
// @route Put api/v1/orders/:id/pay
// @access private/Admin-Manager
export const updateOrderStatusToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError("No such order", 404));
    }
    order.paidAt = new Date();
    order.isPaid = true;
    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// @desc update order paid to delivered
// @route Put api/v1/orders/:id/deliver
// @access private/Admin-Manager
export const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new ApiError("No such order", 404));
    }
    order.deliveredAt = new Date();
    order.isDelivered = true;
    const updatedOrder = await order.save();
    res.status(200).json({
      status: "success",
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// @desc Get checkout session from strip and send it as response
// @route POST api/v1/orders/checkout-session/cartId
// @access private/User
export const checkoutSession = async (req, res, next) => {
  try {
    const taxPrice = 0;
    const shippingPrice = 0;
    // 1) get cart based on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiError("No cart found for this user", 404));
    }
    // 2) get total price cart based on cart (check if coupon is applied)
    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    // 3) create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          name: req.user.name,
          amount:
            totalOrderPrice * 100 /* *100 because strip send amount as .01 */,
          currency: "usd",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.params.cartId,
      metadata: req.body.shippingAddress,
    });

    res.status(201).json({ status: "success", session });
  } catch (error) {
    res.status(400).json(error);
  }
};
