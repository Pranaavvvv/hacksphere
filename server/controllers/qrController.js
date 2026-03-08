const crypto = require("crypto");
const QRCode = require("../models/QRCode");
const User = require("../models/User");

const MEAL_WINDOWS = {
  BREAKFAST: { validFrom: "07:30", validUntil: "09:30" },
  LUNCH: { validFrom: "12:00", validUntil: "14:00" },
  DINNER: { validFrom: "19:00", validUntil: "21:00" },
};

/** POST /api/qr/generate — generate 3 meal QR codes for a student */
async function generateQRCodes(req, res) {
  try {
    const { studentId, hackathonId } = req.body;

    if (!studentId || !hackathonId) {
      return res.status(400).json({ error: "studentId and hackathonId are required" });
    }

    // Check if QR codes already exist
    const existing = await QRCode.find({ studentId, hackathonId });
    if (existing.length === 3) {
      return res.json({ qrCodes: existing, created: false });
    }

    const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"];
    const qrCodes = [];

    for (const mealType of mealTypes) {
      // Skip if already exists
      const exists = await QRCode.findOne({ studentId, hackathonId, mealType });
      if (exists) {
        qrCodes.push(exists);
        continue;
      }

      const uuid = crypto.randomUUID();
      const code = `${mealType}-${studentId}-${hackathonId}-${uuid}`;
      const window = MEAL_WINDOWS[mealType];

      const qr = await QRCode.create({
        studentId,
        hackathonId,
        mealType,
        code,
        validFrom: window.validFrom,
        validUntil: window.validUntil,
      });

      qrCodes.push(qr);
    }

    res.status(201).json({ qrCodes, created: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/qr/:studentId/:hackathonId — fetch student's 3 QR codes */
async function getStudentQRCodes(req, res) {
  try {
    const { studentId, hackathonId } = req.params;

    const qrCodes = await QRCode.find({ studentId, hackathonId }).sort({
      mealType: 1,
    });

    // Attach student name
    const student = await User.findById(studentId).select("name email");

    res.json({ qrCodes, student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { generateQRCodes, getStudentQRCodes };
