const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const xss = require("xss");

router.route("/").get(async (request, response) => {
  let authObj = {};
  try {
    if (request.session.user) {
      authObj.authenticated = true;
      let cals = await userFuncs.getRemainingCalories(request.session.user);
      authObj["calories"] = cals;
    }
    response.status(200).render("pages/exercises", authObj);
  } catch (e) {
    response.status(404).json("404: Page cannot be found");
  }
});
module.exports = router;
