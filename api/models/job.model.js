import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  bidderId: {
    type: String,
    required: true,
  },
});
const jobSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    isBid: {
      type: Boolean,
      default: false,
    },
    doneBy: { 
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bids: [bidSchema],
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default {Job, bidSchema};
