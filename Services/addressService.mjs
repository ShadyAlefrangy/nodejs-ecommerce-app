import { User } from "../models/userModel.mjs";
/* eslint-disable import/prefer-default-export */

// @desc add address to user addresses list
// @route POST api/v1/addresses/
// @access private/User
export const addAddress = async (req, res, next) => {
  try {
    // $addToSet => add address to addresses list
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { addresses: req.body },
      },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Address added successfully to your list",
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc remove address from user addresses list
// @route Delete api/v1/addresses/:addressId
// @access private/User
export const removeAddress = async (req, res, next) => {
  try {
    // $addToSet => add product Id to wishlist if product Id does not exist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { addresses: { _id: req.params.addressId } },
      },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Address removed successfully from your list",
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc get logged user addresses list
// @route get api/v1/addresses/
// @access private/User
export const getLoggedUserAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: "Success",
      results: user.addresses.length,
      data: user.addresses,
    });
  } catch (err) {
    next(err);
  }
};
