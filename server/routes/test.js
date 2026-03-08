const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const { setupTestData } = require("../controllers/testController");

router.post("/setup", verifyToken, setupTestData);

module.exports = router;
