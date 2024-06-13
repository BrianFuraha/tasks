import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import UserModel from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

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
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await UserModel.User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          location: req.body.location,
          about: req.body.about,
          category: req.body.category,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await UserModel.User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const rateRunner = async (req, res, next) => {
  const id = req.params.id;

  const { currentUserId, currentUserIsAdmin, userType, userComment, image } =
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

export const comment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await UserModel.User.findById(id).populate("comments");

    if (!user) {
      return res.status(404).json({ message: "Runner not found!" });
    }

    const newComment = {
      userId: req.body.userId,
      comment: req.body.comment,
      rate: req.body.rate,
      images: req.body.images.map((image) => ({
        userId: req.body.userId,
        image: image.url,
      })),
    };

    user.comments.push(newComment);

    await user.save();

    return res
      .status(200)
      .json({ message: "Comment added successfully!", user });
  } catch (error) {
    next(error);
  }
};

export const getComment = (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
