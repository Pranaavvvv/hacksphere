const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    registeredAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One registration per student per hackathon
registrationSchema.index({ studentId: 1, hackathonId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
