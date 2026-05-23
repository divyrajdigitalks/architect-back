const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getSitePhotos, uploadSitePhoto, deleteSitePhoto } = require("../controllers/sitePhotoController");
const { protect } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);
router.route("/").get(getSitePhotos).post(upload.single("photo"), uploadSitePhoto);
router.delete("/:id", deleteSitePhoto);

module.exports = router;
