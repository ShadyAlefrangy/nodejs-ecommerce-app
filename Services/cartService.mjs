import { Cart } from "../models/cartModel.mjs";
import { Coupon } from "../models/couponModel.mjs";
import { Product } from "../models/productModel.mjs";
import { ApiError } from "../util/apiError.mjs";
/* eslint-disable import/prefer-default-export */
const calcCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};
// @desc Add products to cart
// @route POST api/v1/cart
// @access private/User
export const addProductToCart = async (req, res, next) => {
  try {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);
    // 1. Get cart for logged user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [{ product: productId, color: color, price: product.price }],
      });
    } else {
      // check if product is already in cart, update product quantity
      const productExist = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId && item.color === color
      );
      if (productExist > -1) {
        const cartItem = cart.cartItems[productExist];
        cartItem.quantity += 1;
        cart.cartItems[productExist] = cartItem;
      } else {
        // if not exists in cart, push product to cartItems array
        cart.cartItems.push({
          product: productId,
          color: color,
          price: product.price,
        });
      }
    }
    // calculate total cart price
    cart.totalCartPrice = calcCartTotalPrice(cart);
    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Product added successfully to your cart",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc get Logged User Cart
// @route Get api/v1/cart
// @access private/User
export const getLoggedUserCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError("No cart found for user", 404));
    }
    res.status(200).json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc remove Items From Cart
// @route Put api/v1/cart/:itemId
// @access private/User
export const removeItemsFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        $pull: { cartItems: { _id: req.params.itemId } },
      },
      { new: true }
    );
    if (!cart) {
      return next(new ApiError("No cart found for user", 404));
    }
    cart.totalCartPrice = calcCartTotalPrice(cart);
    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Product removed successfully from cart",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc clear logged user cart
// @route Delete api/v1/cart
// @access private/User
export const clearLoggedUserCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({
      status: "success",
      message: "Your cart cleared successfully",
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc update specific item cart quantity
// @route Put api/v1/cart/change-quantity/:itemId
// @access private/User
export const updateSpecificItemCartQuantity = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError("No cart found for user", 404));
    }
    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex < 0) {
      return next(new ApiError("No product found", 404));
    }
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = cartItem;
    cart.totalCartPrice = calcCartTotalPrice(cart);
    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Quantity was successfully updated",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

// @desc apply coupon to cart
// @route Put api/v1/cart/applyCoupon
// @access private/User
export const applyCouponToCart = async (req, res, next) => {
  try {
    // get coupon based on coupon name
    const coupon = await Coupon.findOne({
      name: req.body.coupon,
      expire: { $gt: Date.now() },
    });
    if (!coupon) {
      return next(new ApiError("Invalid or expired coupon", 404));
    }
    // get logged user cart to get total price of cart items
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError("No cart found for user", 404));
    }
    const totalPriceOfItemsCart = cart.totalCartPrice;
    // calculate total price after discount
    const totalPriceAfterDiscount = (
      totalPriceOfItemsCart -
      (totalPriceOfItemsCart * coupon.discount) / 100
    ).toFixed(2);
    cart.totalPriceAfterDiscount = +totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
