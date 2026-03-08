const Hackathon = require("../models/Hackathon");

/** GET /api/hackathons */
async function listHackathons(req, res) {
  try {
    const hackathons = await Hackathon.find()
      .sort({ startDate: -1 })
      .populate("organizerId", "name email");
    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** GET /api/hackathons/:slug */
async function getHackathon(req, res) {
  try {
    const hackathon = await Hackathon.findOne({ slug: req.params.slug })
      .populate("organizerId", "name email");
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }
    res.json(hackathon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/** POST /api/hackathons (organizer only) */
async function createHackathon(req, res) {
  try {
    const { name, theme, startDate, endDate, mode } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: "Name, startDate, and endDate are required" });
    }

    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const hackathon = await Hackathon.create({
      name,
      slug,
      theme: theme || "",
      startDate,
      endDate,
      mode: mode || "Offline",
      organizerId: req.user.id,
    });

    res.status(201).json(hackathon);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "A hackathon with this name already exists" });
    }
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listHackathons, getHackathon, createHackathon };
