import Chat from "../models/chat.Model.js";

// import { errorHandler } from "../utils/error.js";

export const createChat = async (req, res, next) => {
  const newChat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const userChats = async (req, res, next) => {
  try {
    const chat = await Chat.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

export const findChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
