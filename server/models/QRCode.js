const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema(
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
    mealType: {
      type: String,
      enum: ["BREAKFAST", "LUNCH", "DINNER"],
      required: true,
    },
    code: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    usedAt: { type: Date, default: null },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    validFrom: { type: String, required: true }, // "07:30"
    validUntil: { type: String, required: true }, // "09:30"
  },
  { timestamps: true }
);

// One QR per student per hackathon per meal type
qrCodeSchema.index(
  { studentId: 1, hackathonId: 1, mealType: 1 },
  { unique: true }
);

module.exports = mongoose.model("QRCode", qrCodeSchema);
