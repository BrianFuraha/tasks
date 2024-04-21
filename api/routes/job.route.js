import express from "express";

import {
  // auctionJob,
  bidJob,
  createJob,
  myJobs,
  selectRunner,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/createJob", createJob);
// router.get("/auctionJob", auctionJob);
router.get("/myJob", myJobs);
router.put("/:id/bidJob", bidJob);
router.put("/:id/selectRunner", selectRunner);

export default router;
