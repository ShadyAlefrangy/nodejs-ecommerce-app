import express from "express";
import path from "path";
import * as dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { dbConnect } from "./util/db-connect.mjs";
import { ApiError } from "./util/apiError.mjs";
import { globalErrorHandler } from "./middlewares/errorMiddleware.mjs";
import { mountedRoutes } from "./routes/index.mjs";
import { webhookCheckout } from "./Services/orderService.mjs";
// load .env files content into process.env
dotenv.config();
const PORT = process.env.PORT || 8000;
// create express server
const app = express();
// enable cors (enable others domains to access my app)
app.use(cors());
app.options("*", cors());
// compress all responses
app.use(compression());
// Connect to DB
dbConnect();
// webhook checkout
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);
// Middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.resolve("uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// Apply data sanitization
app.use(mongoSanitize());
app.use(xss());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message:
    "Too many accounts created from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);
// middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
// Routes
mountedRoutes(app);

// middleware for undefined routes
app.all("*", (req, res, next) => {
  // create error and send it to error handling middleware
  next(new ApiError(`Can not find this route: ${req.originalUrl}`, 400));
});
// Global error handling middleware for express
app.use(globalErrorHandler);

// run the server at specific port
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Handling rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Server is shutting down...");
    process.exit(1);
  });
});
