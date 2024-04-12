import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import UserModel from "../models/user.model.js";

export const getUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await UserModel.User.findById(id);

    if (user) {
      const { password: pass, ...rest } = user._doc;
      res.status(200).json(rest);
    } else {
      res.status(404).json("User does not exist!!!");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { currentUserId, currentUserIsAdmin, password } = req.body;

  if (id === currentUserId && !currentUserIsAdmin) {
    try {
      if (password) {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        req.body.password = hashedPassword;
      }
      const user = await UserModel.User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  const { currentUserId, currentUserIsAdmin } = req.body;

  if (currentUserId == id || currentUserIsAdmin) {
    try {
      await UserModel.User.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      next(error);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};

export const rateRunner = async (req, res, next) => {
  const id = req.params.id;

  const { currentUserId, currentUserIsAdmin, userType, userComment, userRate } =
    req.body;

  if (currentUserId === id || userType == "runner" || currentUserIsAdmin) {
    res.status(403).json("Action forbiden!");
  } else {
    try {
      const user = await UserModel.User.findById(id).populate({
        path: "comments",
        populate: {
          path: "userId",
          model: "User",
        },
      });
      if (!user) {
        return res.status(404).json("Runner not found!");
      }
      user.comments.push({
        userId: currentUserId,
        rate: userRate,
        comment: userComment,
      });

      let totalRates = 0;
      let numComments = user.comments.length;

      user.comments.forEach((comment) => {
        if (comment.rate) {
          totalRates += comment.rate;
        }
      });

      const averageRate = numComments > 0 ? totalRates / numComments : 0;

      user.ratings = averageRate.toFixed(1);
      user.save();
      res.status(200).json("Runner rated successfully");
    } catch (error) {
      next(error);
    }
  }
};
