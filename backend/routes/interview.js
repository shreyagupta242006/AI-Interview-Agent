const express = require("express");
const router = express.Router();

const {
  handleInterview,
} = require("../controllers/interviewController");

router.post("/", handleInterview);

module.exports = router;