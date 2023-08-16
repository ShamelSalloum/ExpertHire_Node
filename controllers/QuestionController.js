import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Question from "../models/Question_Model";

export let blacklist = [];

export const getAllQuestions = catchAsyncErrors(async (req, res, next) => {
  try {
    const question = await Question.find();
    const web = question.filter((req) => req.category === "web");
    const video = question.filter((req) => req.category === "video");
    const building = question.filter((req) => req.category === "building");
    const logo = question.filter((req) => req.category === "logo");
    res.status(200).json({
      success: true,
      web,
      building,
      logo,
      video,
    });
  } catch (error) {
    // Handle any errors that occur during the execution of this function.
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

export const addQuestion = catchAsyncErrors(async (req, res, next) => {
  try {
    const { title, category, enable } = req.body;
    const question = await Question.create({
      title,
      category,
      enable,
    });
    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    // Handle any errors that occur during the execution of this function.
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

export const addQuestions = catchAsyncErrors(async (req, res, next) => {
  try {
    const { questions } = req.body;
    const createdQuestions = await Promise.all(
      questions.map(async (questionData) => {
        const { title, category, enable } = questionData;
        const question = await Question.create({
          title,
          category,
          enable,
        });
        return question;
      })
    );
    res.status(200).json({
      success: true,
      questions: createdQuestions,
    });
  } catch (error) {
    // Handle any errors that occur during the execution of this function.
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});
