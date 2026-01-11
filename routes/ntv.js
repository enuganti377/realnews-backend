const express = require("express");
const { NTVNews } = require("../controllers/NTVcontroller");
const router = express.Router();

router.get("/NTV",NTVNews);

module.exports = router;
