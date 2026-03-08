const Hackathon = require("../models/Hackathon");
const User = require("../models/User");
const QRCode = require("../models/QRCode");
const crypto = require("crypto");

const MEAL_WINDOWS = {
  BREAKFAST: { validFrom: "07:30", validUntil: "09:30" },
  LUNCH: { validFrom: "12:00", validUntil: "14:00" },
  DINNER: { validFrom: "19:00", validUntil: "21:00" },
};

/**
 * POST /api/test/setup
 * Creates a test hackathon, links the current user to it, and generates QR codes.
 * For quick testing without full registration flow.
 */
async function setupTestData(req, res) {
  try {
    const userId = req.user.id;

    // 1. Find or create a test hackathon
    let hackathon = await Hackathon.findOne({ slug: "test-hackathon" });
    if (!hackathon) {
      hackathon = await Hackathon.create({
        name: "Test Hackathon",
        slug: "test-hackathon",
        theme: "QR Testing",
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        mode: "Offline",
        organizerId: userId,
      });
    }

    // 2. Link user to hackathon
    await User.findByIdAndUpdate(userId, { hackathonId: hackathon._id });

    // 3. Generate QR codes if they don't exist
    const existing = await QRCode.find({
      studentId: userId,
      hackathonId: hackathon._id,
    });

    let qrCodes = existing;
    if (existing.length < 3) {
      const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"];
      qrCodes = [];
      for (const mealType of mealTypes) {
        let qr = await QRCode.findOne({
          studentId: userId,
          hackathonId: hackathon._id,
          mealType,
        });
        if (!qr) {
          const uuid = crypto.randomUUID();
          const code = `${mealType}-${userId}-${hackathon._id}-${uuid}`;
          qr = await QRCode.create({
            studentId: userId,
            hackathonId: hackathon._id,
            mealType,
            code,
            validFrom: MEAL_WINDOWS[mealType].validFrom,
            validUntil: MEAL_WINDOWS[mealType].validUntil,
          });
        }
        qrCodes.push(qr);
      }
    }

    // 4. Get updated user
    const user = await User.findById(userId);

    res.json({
      message: "Test data created successfully",
      hackathon,
      user,
      qrCodes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { setupTestData };
