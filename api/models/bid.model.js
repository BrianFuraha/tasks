import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
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
    location: {
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
    bidders: {
      type: [String],
      default: [],
    },
    numberOfBids: {
      type: [Number],
      default: o,
    },
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", bidSchema);

export default Bid;