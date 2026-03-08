const QRCode = require("../models/QRCode");
const MealScan = require("../models/MealScan");
const User = require("../models/User");

const MEAL_WINDOWS = {
  BREAKFAST: { fromHour: 7, fromMin: 30, toHour: 9, toMin: 30 },
  LUNCH: { fromHour: 12, fromMin: 0, toHour: 14, toMin: 0 },
  DINNER: { fromHour: 19, fromMin: 0, toHour: 24, toMin: 0 },
};

function isWithinMealWindow(mealType) {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const w = MEAL_WINDOWS[mealType];
  if (!w) return false;
  const start = w.fromHour * 60 + w.fromMin;
  const end = w.toHour * 60 + w.toMin;
  return minutes >= start && minutes <= end;
}

/** POST /api/scanner/scan */
async function scanQR(req, res) {
  try {
    const { code, scannedBy, hackathonId } = req.body;

    if (!code || !scannedBy || !hackathonId) {
      return res.status(400).json({ error: "code, scannedBy, and hackathonId are required" });
    }

    // 1. Find QR by code
    const qr = await QRCode.findOne({ code });

    if (!qr) {
      // Log the failed scan
      await MealScan.create({
        hackathonId,
        scannedBy,
        scannedAt: new Date(),
        status: "NOT_FOUND",
        code,
      });
      return res.json({ status: "NOT_FOUND", message: "Invalid QR code" });
    }

    // Fetch student name
    const student = await User.findById(qr.studentId).select("name email");

    // 2. Check if already used
    if (qr.used) {
      await MealScan.create({
        qrCodeId: qr._id,
        studentId: qr.studentId,
        hackathonId,
        mealType: qr.mealType,
        scannedBy,
        scannedAt: new Date(),
        status: "ALREADY_USED",
        code,
      });
      return res.json({
        status: "ALREADY_USED",
        message: "Already redeemed",
        mealType: qr.mealType,
        studentName: student?.name || "Unknown",
        usedAt: qr.usedAt,
      });
    }

    // 3. Check time window
    if (!isWithinMealWindow(qr.mealType)) {
      await MealScan.create({
        qrCodeId: qr._id,
        studentId: qr.studentId,
        hackathonId,
        mealType: qr.mealType,
        scannedBy,
        scannedAt: new Date(),
        status: "INVALID_WINDOW",
        code,
      });
      return res.json({
        status: "INVALID_WINDOW",
        message: `Outside meal window (${qr.validFrom} – ${qr.validUntil})`,
        mealType: qr.mealType,
        studentName: student?.name || "Unknown",
      });
    }

    // 4. Mark as used
    qr.used = true;
    qr.usedAt = new Date();
    qr.scannedBy = scannedBy;
    await qr.save();

    // 5. Log successful scan
    await MealScan.create({
      qrCodeId: qr._id,
      studentId: qr.studentId,
      hackathonId,
      mealType: qr.mealType,
      scannedBy,
      scannedAt: new Date(),
      status: "SUCCESS",
      code,
    });

    return res.json({
      status: "SUCCESS",
      message: "Meal redeemed successfully",
      mealType: qr.mealType,
      studentName: student?.name || "Unknown",
      scannedAt: qr.usedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/scanner/stats/:hackathonId */
async function getStats(req, res) {
  try {
    const { hackathonId } = req.params;

    const qrCodes = await QRCode.find({ hackathonId });

    const stats = {
      breakfast: { used: 0, total: 0 },
      lunch: { used: 0, total: 0 },
      dinner: { used: 0, total: 0 },
    };

    for (const qr of qrCodes) {
      const key = qr.mealType.toLowerCase();
      stats[key].total++;
      if (qr.used) stats[key].used++;
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/scanner/logs/:hackathonId */
async function getLogs(req, res) {
  try {
    const { hackathonId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    const logs = await MealScan.find({ hackathonId })
      .sort({ scannedAt: -1 })
      .limit(limit)
      .populate("studentId", "name email")
      .populate("scannedBy", "name");

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { scanQR, getStats, getLogs };
