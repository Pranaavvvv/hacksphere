const router = require("express").Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  listHackathons,
  getHackathon,
  createHackathon,
} = require("../controllers/hackathonController");

router.get("/", verifyToken, listHackathons);
router.get("/:slug", verifyToken, getHackathon);
router.post("/", verifyToken, requireRole("organizer", "admin"), createHackathon);

module.exports = router;
