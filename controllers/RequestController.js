import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Question from "../models/Question_Model";
import Request from "../models/RequestModel";

export let blacklist = [];

export const GetAllRequest = catchAsyncErrors(async (req, res, next) => {
  const requests = await Request.find();
  res.status(200).json({
    success: true,
    requests,
  });
});

export const getRequest = catchAsyncErrors(async (req, res, next) => {
  try {
    const request = await Request.findOne({ _id: req.body.id });

    const answersWithQuestions = await Promise.all(request.answers.map(async (answer) => {
      try {
        const question = await Question.findById(answer.question_id);
        if (question) {
          return {
            ...answer.toObject(),
            title: question.title,
          };
        }
      } catch (error) {
        console.error("Error fetching question:", error.message);
      }
    }));

    res.status(200).json({
      success: true,
      request: {
        ...request.toObject(),
        answers: answersWithQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching request:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export const getUserRequest = catchAsyncErrors(async (req, res, next) => {
  let requests;

  if (!req.body.user_id)
    requests = await Request.find({ user_id: req.user.id });
  else
    requests = await Request.find({ user_id: req.body.user_id });

  try {
    const requestsWithTitles = await Promise.all(
      requests.map(async (request, index) => { // Added 'index' parameter to get the request number
        const answersWithTitles = await Promise.all(
          request.answers.map(async (answer) => {
            try {
              const question = await Question.findById(answer.question_id);
              if (question) {
                return {
                  ...answer.toObject(),
                  title: question.title,
                };
              }
            } catch (error) {
              console.error("Error fetching question:", error.message);
            }
          })
        );

        return {
          ...request.toObject(),
          answers: answersWithTitles,
        };
      })
    );

    res.status(200).json({
      success: true,
      requests: requestsWithTitles,
    });
  } catch (error) {
    console.error("Error processing answers:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


export const addRequest = catchAsyncErrors(async (req, res, next) => {
  try {
    const { first_name, last_name, location, email, phone, answers, budget, type } = req.body;
    const user_id = req.user?.id;
    const newRequest = await Request.create({
      user_id,
      first_name,
      last_name,
      type,
      budget,
      location,
      email,
      phone,
      answers,
    });

    res.status(200).json({
      success: true,
      request: newRequest,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create the request.",
      error: error.message,
    });
  }
});


export const acceptRequest = catchAsyncErrors(async (req, res, next) => {
  const request_id = req.body.request_id;
  const request = await Request.findByIdAndUpdate(
    request_id,
    {
      status: "Accepted",
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    request: request,
  });
});


export const rejectRequest = catchAsyncErrors(async (req, res, next) => {
  const request_id = req.body.request_id;
  const request = await Request.findByIdAndUpdate(
    request_id,
    {
      status: "Rejected",
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    request: request,
  });
});

export const getRejectedRequests = catchAsyncErrors(async (req, res, next) => {
  try {
    const requests = await Request.find({ status: "Rejected" });
    const web = requests.filter((req) => req.type === "web");
    const logo = requests.filter((req) => req.type === "logo");
    const building = requests.filter((req) => req.type === "building");
    const video = requests.filter((req) => req.type === "video");
    res.status(200).json({
      success: true,
      web: web,
      video: video,
      building: building,
      logo: logo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rejected requests.",
      error: error.message,
    });
  }
});

export const getAcceptedRequests = catchAsyncErrors(async (req, res, next) => {
  try {
    const requests = await Request.find({ status: "Accepted" });
    const web = requests.filter((req) => req.type === "web");
    const logo = requests.filter((req) => req.type === "logo");
    const building = requests.filter((req) => req.type === "building");
    const video = requests.filter((req) => req.type === "video");
    res.status(200).json({
      success: true,
      web: web,
      video: video,
      building: building,
      logo: logo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch accepted requests.",
      error: error.message,
    });
  }
});


export const getPendingRequests = catchAsyncErrors(async (req, res, next) => {
  try {
    const requests = await Request.find({ status: "Pending" });
    const web = requests.filter((req) => req.type === "web");
    const logo = requests.filter((req) => req.type === "logo");
    const building = requests.filter((req) => req.type === "building");
    const video = requests.filter((req) => req.type === "video");
    res.status(200).json({
      success: true,
      web: web,
      video: video,
      building: building,
      logo: logo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch accepted requests.",
      error: error.message,
    });
  }
});


export const getWebRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await Request.find({ type: "web" });
  res.status(200).json({
    success: true,
    requests,
  });
});

export const getVideoRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await Request.find({ type: "video" });
  res.status(200).json({
    success: true,
    requests,
  });
});

export const getBuildingRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await Request.find({ type: "building" });
  res.status(200).json({
    success: true,
    requests,
  });
});

export const getLogoRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await Request.find({ type: "logo" });
  res.status(200).json({
    success: true,
    requests,
  });
});

