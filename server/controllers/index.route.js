const express = require('express');
const router = express.Router();

const jobRoutes = require("./job/job.route");
const problemRoutes = require("./problem/problem.route")
router.get("/readiness", (req, res, next) => {
  try {
    console.log("Requested..")
    res.send(`<h1 style="color:red;">Server is up bro in __${process.env.NODE_ENV}__ mode</h1>`);;
  } catch (e) {
    next(e);
  }
});
router.use("/job", jobRoutes);
router.use("/problem", problemRoutes);

module.exports = router;
