import express from "express";

import {
  // auctionJob,
  bidJob,
  createJob,
  getAuctions,
  myJobs,
  selectRunner,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/createJob", createJob);
router.post("/auctionJob", createJob);
router.get("/:id/myJob", myJobs);
router.get("/auctions", getAuctions);
router.put("/:id/bidJob", bidJob);
router.put("/:id/selectRunner", selectRunner);

export default router;
