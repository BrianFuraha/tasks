import express from "express";
import { addMessage, getMessages } from "../controllers/message.controller.js";


const router = express.Router();

router.post("/newMassage", addMessage);
router.get("/:chatId", getMessages);

export default router;
