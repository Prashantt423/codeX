const express = require('express');
const router = express.Router();
const jobService = require("../../services/job/job.service")
router.get("/status", jobService.getStatus);
router.post("/run", jobService.runCode);
module.exports = router;
