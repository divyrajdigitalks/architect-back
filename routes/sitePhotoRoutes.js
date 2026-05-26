const express = require("express");
const router = express.Router();
const { getSitePhotos, uploadSitePhoto, deleteSitePhoto } = require("../controllers/sitePhotoController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.route("/").get(getSitePhotos).post(upload.array("photos", 20), uploadSitePhoto);
router.delete("/:id", deleteSitePhoto);

module.exports = router;
