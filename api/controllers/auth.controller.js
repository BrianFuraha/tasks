import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};

export const signin = async (req, res, err) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return err(errorHandler(404, "User not found!!!"));

    const validPassword = bcryptjs.compare(password, validUser.password);
    if (!validPassword) return err(errorHandler(401, "Wrong credentials!!!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};
