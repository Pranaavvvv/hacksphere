const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    theme: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mode: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"],
      default: "Offline",
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalParticipants: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hackathon", hackathonSchema);
