/* eslint-disable import/prefer-default-export */
import mongoose from "mongoose";

export async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.log(error);
  }
}
