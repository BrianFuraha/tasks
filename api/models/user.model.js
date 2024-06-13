import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
});

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  rate: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  images: [imageSchema],
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd5avdba8EiOZH8lmV3XshrXx7dKRZvhx-A&s",
    },
    location: { type: String },
    about: { type: String },
    ratings: { type: Number, default: 0 },
    comments: [commentSchema],
    category: {
      type: [String],
    },
    images: [imageSchema],
    userType: {
      type: String,
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default { User, commentSchema, imageSchema };
