import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    locationtion: {
      type: String,
      required: true,
    },
    amountToPay: {
      type: Number,
      default: 0,
    },
    isBid: {
      type: Boolean,
      default: false,
    },
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    image: String,
    bidds: [],
  },
  { timestamps: true }
);

const Job = mongoose.model("job", jobSchema);

export default Job;
