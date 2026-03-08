const mongoose = require("mongoose");

const mealScanSchema = new mongoose.Schema(
  {
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRCode",
      default: null,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    mealType: {
      type: String,
      enum: ["BREAKFAST", "LUNCH", "DINNER"],
      default: "BREAKFAST",
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scannedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["SUCCESS", "ALREADY_USED", "INVALID_WINDOW", "NOT_FOUND"],
      required: true,
    },
    code: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealScan", mealScanSchema);
