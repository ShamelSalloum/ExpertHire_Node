import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error";
import mongoose from "mongoose";
import dotenv from "dotenv";
import user from "./routes/userRoute";
import fileUpload from "express-fileupload"
import Question from "./models/Question_Model";
import Category from "./models/CategoryModel";

const app = express();

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`DB Connection Successfully! ${process.env.PORT}`))
  .catch((err) => {
    console.log(err);
  });


  


app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/api/v1", user);
app.use("/api/v1", Question);
app.use("/api/v1", Category);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(errorMiddleware);

app.listen(process.env.PORT || 4000, () => {
  console.log("Backend server is running!");
});

