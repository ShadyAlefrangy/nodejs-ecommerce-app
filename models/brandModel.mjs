import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minLength: [
        3,
        "Too short, brand name must be more than or equal 3 characters",
      ],
      maxLength: [
        32,
        "Too long, brand name must be less than or equal 32 characters",
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// this middleware works with getAll, get and update
brandSchema.post("init", (doc) => {
  // return image base url + image name
  setImageUrl(doc);
});
// works with create new category
brandSchema.post("save", (doc) => {
  // return image base url + image name
  setImageUrl(doc);
});
// eslint-disable-next-line import/prefer-default-export
export const Brand = mongoose.model("Brand", brandSchema, "brands");
