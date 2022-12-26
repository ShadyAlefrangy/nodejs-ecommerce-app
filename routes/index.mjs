/* eslint-disable import/prefer-default-export */

import { addressRouter } from "./addressRoute.mjs";
import { AuthRouter } from "./authRoute.mjs";
import { brandRouter } from "./brandRoute.mjs";
import { cartRouter } from "./cartRoute.mjs";
import { categoryRouter } from "./categoryRoute.mjs";
import { couponRouter } from "./couponRoute.mjs";
import { orderRouter } from "./orderRoute.mjs";
import { productRouter } from "./productRoute.mjs";
import { reviewRouter } from "./reviewRoute.mjs";
import { subCategoryRouter } from "./subCategoryRoute.mjs";
import { UserRouter } from "./userRoute.mjs";
import { wishlistRouter } from "./wishlistRoute.mjs";

/* eslint-disable no-undef */
export const mountedRoutes = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", UserRouter);
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/orders", orderRouter);
};
