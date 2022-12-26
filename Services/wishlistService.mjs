import { User } from "../models/userModel.mjs";
/* eslint-disable import/prefer-default-export */

// @desc add product to wishlist
// @route POST api/v1/wishlist/
// @access private/User
export const addProductToWishlist = async (req, res, next) => {
  try {
    // $addToSet => add product Id to wishlist if product Id does not exist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { wishlist: req.body.productId },
      },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product added successfully to your wishlist",
      data: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc remove product from wishlist
// @route Delete api/v1/wishlist/:productId
// @access private/User
export const removeProductFromWishlist = async (req, res, next) => {
  try {
    // $addToSet => add product Id to wishlist if product Id does not exist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product removed successfully from your wishlist",
      data: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

// @desc get logged user wishlist
// @route get api/v1/wishlist/
// @access private/User
export const getLoggedUserWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({
      status: "Success",
      results: user.wishlist.length,
      data: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};
