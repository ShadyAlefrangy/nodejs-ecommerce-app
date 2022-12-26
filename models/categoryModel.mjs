/* eslint-disable import/prefer-default-export */
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      minLength: [3, "Too short, name must be more than or equal 3 characters"],
      maxLength: [
        32,
        "Too long, name must be less than or equal 32 characters",
      ],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// this middleware works with getAll, get and update
categorySchema.post("init", (doc) => {
  // return image base url + image name
  setImageUrl(doc);
});
// works with create new category
categorySchema.post("save", (doc) => {
  // return image base url + image name
  setImageUrl(doc);
});

export const Category = mongoose.model(
  "Category",
  categorySchema,
  "categories"
);
