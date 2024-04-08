import Message from "../models/messages.model.js";

export const addMessage = async (req, res, next) => {
  const { chatId, senderId, text } = req.body;
  const message = new Message({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { chatId } = req.params;
  try {
    const result = await Message.find({ chatId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
