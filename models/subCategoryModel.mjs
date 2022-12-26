import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      minLength: [2, "Too short, name must be more than or equal 3 characters"],
      maxLength: [
        32,
        "Too long, name must be less than or equal 32 characters",
      ],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be belong to main category"],
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line import/prefer-default-export
export const SubCategory = mongoose.model(
  "SubCategory",
  subCategorySchema,
  "subCategories"
);
