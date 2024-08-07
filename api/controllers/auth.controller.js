import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { errorHandler } from "../utils/error.js";
import UserModel from "../models/user.model.js";

export const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new UserModel.User({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await UserModel.User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!!!"));
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!!!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    if (validUser.userType === "runner") {
      const roundToNearestHalf = (num) => {
        return Math.round(num * 2) / 2;
      };
      // Calculate the average rate of comments
      const commentsWithRate = validUser.comments.filter(
        (comment) => comment.rate !== undefined
      );
      const totalRate = commentsWithRate.reduce(
        (sum, comment) => sum + comment.rate,
        0
      );
      const averageRate =
        commentsWithRate.length > 0 ? totalRate / commentsWithRate.length : 0;

      // Round the average rate to the nearest 0.5
      validUser.ratings = roundToNearestHalf(averageRate);

      // Save the user document with the updated ratings
      await validUser.save();
    }

    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await UserModel.User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const genPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(genPassword, 10);
      const newUser = new UserModel.User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        avatar: req.body.image,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
