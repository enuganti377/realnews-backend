const express = require("express");
const router = express.Router();
const { JobsNEWS } = require("../controllers/jobcontroller");


router.get("/job", JobsNEWS);

module.exports = router;

