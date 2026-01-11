const express = require("express");
const router = express.Router();

const{TeluguNews} = require("../controllers/telugu");

router.get("/telugu",TeluguNews);

module.exports= router;

