import express from "express";
import { deleteUser, getAllRunners, getRunners, getUser, rateRunner, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/getRunners/:category", getRunners);
router.get("/getAllRunners", getAllRunners);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/rate", rateRunner);

export default router;
