const express = require("express");
const router = express.Router();
const {EnglishNews} = require("../controllers/english");

router.get("/fetch", EnglishNews);

module.exports = router;

