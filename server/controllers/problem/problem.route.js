const express = require('express');
const router = express.Router();
const problemService = require("../../services/problem/problem.service")
router.post("/add",problemService.addQuestion);
router.get("/get",problemService.getQuestion);
router.get("/getAll",problemService.getAllQuestions);
module.exports = router;
