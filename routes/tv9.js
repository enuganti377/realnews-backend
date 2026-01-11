const express = require("express");
const router = express.Router();
const {TV9News} = require("../controllers/TV9controller");

router.get("/TV9",TV9News);

module.exports= router;
