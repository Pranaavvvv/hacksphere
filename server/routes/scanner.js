const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const { scanQR, getStats, getLogs } = require("../controllers/scannerController");

router.post("/scan", verifyToken, scanQR);
router.get("/stats/:hackathonId", verifyToken, getStats);
router.get("/logs/:hackathonId", verifyToken, getLogs);

module.exports = router;
