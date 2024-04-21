import JobModel from "../models/job.model.js";
import UserModel from "../models/user.model.js";

export const createJob = async (req, res, next) => {
  try {
    const job = await JobModel.Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// export const auctionJob = async (req, res, next) => {
//   try {
//     const job = await JobModel.Job.create(req.body);
//     res.status(201).json(job);
//   } catch (error) {
//     next(error);
//   }
// };

export const bidJob = async (req, res, next) => {
  const id = req.params.id;
  const { currentUserId } = req.body;

  try {
    const auctionedJob = await JobModel.Job.findById(id).populate({
      path: "bids",
      populate: { path: "bidderId", model: "User" },
    });

    if (!auctionedJob) {
      res.status(404).json("Wéra not found");
      return;
    }

    const user = await UserModel.User.findById(currentUserId);

    if (user) {
      if (user.userType == "user" && user.isAdmin) {
        res.status(403).json("Action Forbidden");
        return;
      }
      if (auctionedJob.bids.some((bids) => bids.bidderId === currentUserId)) {
        res.status(403).json("You have already bidded");
        return;
      }
      auctionedJob.bids.push({
        bidderId: currentUserId,
      });

      await auctionedJob.save();

      res.status(200).json("Bid placed successfully!");
    } else {
      res.status(404).json("User does not exist!!!");
    }
  } catch (error) {
    next(error);
  }
};

export const selectRunner = async (req, res, next) => {
  const id = req.params.id;
  const { runnerId } = req.body;

  try {
    const user = await UserModel.User.findById(runnerId);

    if (!user) {
      res.status(404).json("User does not exist!!!");
      return;
    }

    if (user.isAdmin || user.userType == "user") {
      res.status(403).json("Action Forbiden!");
      return;
    }

    const job = await JobModel.Job.findByIdAndUpdate(
      id,
      { doneBy: runnerId },
      {
        new: true,
      }
    );

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
    const jobs = await JobModel.Job.find({ ownerId: id });
    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};
