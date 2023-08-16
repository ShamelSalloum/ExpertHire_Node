import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
    },
    phone: {
      type: Number,
      required: [true, "Please Enter Your Mobile"],
      minLength: [10, "Mobile should be greater than 10 characters"],
    },
    answers: [
      {
        question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        answer: String,
      },
    ],
    budget: {
      type: Number,
      required: [true, "budget is missing"],
    },
    type: {
      type: String,
      required: [true, "Please Choose Category"],
    },
    status: {
      type: String,
      default: "Pending",
    },
    requestNumber: { type: Number, unique: true },
  },

  { timestamps: true }
);
RequestSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const existingRequestsCount = await this.constructor.countDocuments();
      this.requestNumber = existingRequestsCount + 1;
    }
    next();
  } catch (error) {
    next(error);
  }
});
const Request = mongoose.model("Request", RequestSchema);
export default Request;
