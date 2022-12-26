/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import multer from "multer";
import { ApiError } from "../util/apiError.mjs";

const multerOptions = () => {
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}-${ext}`;
  //     cb(null, fileName);
  //   },
  // });
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Images only allowed", 404), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};
export const uploadSingleImage = (filedName) =>
  multerOptions().single(filedName);
export const uploadMultipleImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
