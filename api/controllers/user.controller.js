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

export const getRunners = async (req, res, next) => {
  const { category } = req.params;
  try {
    const users = await UserModel.User.find({ category: category });

    if (!users) {
      const { password: pass, ...rest } = users._doc;
      res.status(200).json(rest);
    } else {
      res.status(404).json("User does not exist!!!");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllRunners = async (req, res, next) => {
  const { category } = req.query; // Assuming category is passed as a query parameter
  if (!category) {
    try {
      let query = { userType: "runner" }; // Default query to find runners
      if (category) {
        // If category is provided, add it to the query
        query.category = category;
      }

      const runners = await UserModel.User.find(query);

      if (!runners || runners.length === 0) {
        return res
          .status(404)
          .json("No runners found for the specified category!");
      }

      const runnersData = runners.map(({ _doc }) => {
        const { password, ...rest } = _doc;
        return rest;
      });

      res.status(200).json(runnersData);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const users = await UserModel.User.find({});
      const runners = users.filter((user) => user.userType === "runner");

      if (!runners || runners.length === 0) {
        return res.status(404).json("No runners found!");
      }
      const runnersData = runners.map(({ _doc }) => {
        const { password, ...rest } = _doc;
        return rest;
      });

      res.status(200).json(runnersData);
    } catch (error) {
      next(error);
    }
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
