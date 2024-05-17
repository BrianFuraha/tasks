import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import jobRouter from "./routes/job.route.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/job", jobRouter);

app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
