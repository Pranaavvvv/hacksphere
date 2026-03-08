const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const { generateQRCodes, getStudentQRCodes } = require("../controllers/qrController");

router.post("/generate", verifyToken, generateQRCodes);
router.get("/:studentId/:hackathonId", verifyToken, getStudentQRCodes);

module.exports = router;
