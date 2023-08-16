import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Category from "../models/CategoryModel";


export let blacklist =[]


export const GetAllCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.find();
    res.status(200).json({
      success: true,
      category,
    });
  });
  