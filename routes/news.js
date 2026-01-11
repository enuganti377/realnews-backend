const express = require("express");
const router = express.Router();
const { postnews } = require("../controllers/temp");
console.log("postnews type:", typeof postnews);


router.post("/post", postnews);

module.exports = router;