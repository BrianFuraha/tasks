import express from "express";
import { deleteUser, getAllRunners, getRunners, getUser, rateRunner, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verfy.user.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/getRunners/:category", getRunners);
router.get("/", getAllRunners);
router.put("/updateUser/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.put("/:id/rate", rateRunner);

export default router;
