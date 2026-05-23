const express = require("express");
const router = express.Router();
const { getSiteUpdates, getSiteUpdate, createSiteUpdate, updateSiteUpdate, deleteSiteUpdate } = require("../controllers/siteUpdateController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getSiteUpdates).post(createSiteUpdate);
router.route("/:id").get(getSiteUpdate).put(updateSiteUpdate).delete(deleteSiteUpdate);

module.exports = router;
