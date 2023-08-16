import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter your title"],
      maxLength: [700, "Title cannot exceed 30 characters"],
      minLength: [3, "Title should have more than 3 characters"],
    },
    category: {
      type: String,
      required: [true, "Please Add Category ID"],
    },
    enable: {
      type: Boolean,
      default: true,
      required: [false],
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
