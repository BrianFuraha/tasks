import JobModel from "../models/job.model.js";
import UserModel from "../models/user.model.js";

export const createJob = async (req, res, next) => {
  try {
    const user = await UserModel.User.findById(req.body.ownerId);
    if (user.userType === "user") {
      const job = await JobModel.Job.create(req.body);
      res.status(201).json({ message: "Job created", job });
    } else {
      res.status(403).json({ message: "Action not allowed" });
    }
  } catch (error) {
    next(error);
  }
};

export const bidJob = async (req, res, next) => {
  const id = req.params.id;
  const { currentUserId } = req.body;

  try {
    // Retrieve the job by its ID
    const job = await JobModel.Job.findById(id);

    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    if (!job.isBid) {
      res.status(403).json({ message: "Bidding not allowed for this job" });
      return;
    }

    // Populate the bids and bidder details
    await job.populate({
      path: "bids",
      populate: { path: "bidderId", model: "User" },
    });

    // Retrieve the current user
    const user = await UserModel.User.findById(currentUserId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if the user is a runner
    if (user.userType !== "runner") {
      res.status(403).json({ message: "You are not a runner" });
      return;
    }

    // Check if the user has already placed a bid
    const hasAlreadyBid = job.bids.reduce(
      (acc, bid) => acc || bid.bidderId._id.toString() === user._id.toString(),
      false
    );

    if (hasAlreadyBid) {
      return res.status(403).json({ message: "You have already placed a bid" });
    }

    // Add the new bid
    job.bids.push({
      bidderId: currentUserId,
      // You can add other bid details here, such as amount, timestamp, etc.
    });

    // Save the updated job with the new bid
    await job.save();

    res.status(200).json({ message: "Bid placed successfully!" });
  } catch (error) {
    next(error);
  }
};

export const selectRunner = async (req, res, next) => {
  const id = req.params.id;
  const { runnerId } = req.body;

  try {
    // Fetch the job document first
    const job = await JobModel.Job.findById(id);

    if (!job) {
      res.status(404).json("Job not found!!!");
      return;
    }

    // Check if doneBy field is already populated
    if (job.doneBy) {
      res.status(400).json("A runner is already selected!!!");
      return;
    }

    const user = await UserModel.User.findById(runnerId);

    if (!user) {
      res.status(404).json("Runner does not exist!!!");
      return;
    }

    if (user.isAdmin || user.userType == "user") {
      res.status(403).json("The user is not a runner!!!");
      return;
    }

    // Update the job with the runner ID
    job.doneBy = runnerId;
    await job.save();

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};


export const myJobs = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await UserModel.User.findById(id);

    if (!user) {
      res.status(404).json("User does not exist!!!");
      return;
    }

    if (user.isAdmin) {
      const jobs = await JobModel.Job.find();
      res.status(200).json(jobs);
      return;
    }

    if (user.userType == "user") {
      const jobs = await JobModel.Job.find({ ownerId: id });
      res.status(200).json(jobs);
    }
    if (user.userType == "runner") {
      const jobs = await JobModel.Job.find({ doneBy: id });
      res.status(200).json(jobs);
    }
  } catch (error) {
    next(error);
  }
};
