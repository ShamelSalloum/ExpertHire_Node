import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your first Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 3 characters"],
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", CategorySchema);
export default Category;
