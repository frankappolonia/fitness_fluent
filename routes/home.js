const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const xss = require('xss')

router.route("/").get(async (request, response) => {
  let authObj = {};
  try {
    if (request.session.user) {
      //validate if logged in
      let id = validations.checkId(request.session.user);

      authObj.authenticated = true;
      //stuff for daily goals widget
      let nutrients = await userFuncs.getRemainingCalories(xss(id));
      authObj = { ...authObj, ...nutrients };

      //---------------------------------------"
    }
    authObj["css"] = "/public/css/main_styles.css";
    authObj["script"] = "/public/js/filler.js";
    authObj["script2"] = "/public/js/filler.js";

    response.status(200).render("pages/homepage", authObj);
  } catch (e) {
    console.log(e)
    response.status(404).render("errors/404");
  }
});
module.exports = router;
