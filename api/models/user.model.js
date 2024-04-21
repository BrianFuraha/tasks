import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  rate: {
    type: "Number",
  },
  comment: {
    type: "String",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: String,
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
    category: [],
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

export default { User, commentSchema };
