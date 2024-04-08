import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
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
    deadline: {
      type: Number,
      required: true,
    },
    amountToPay: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("job", bidSchema);

export default Job;
