const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const xss = require("xss");

//if the user is NOT authenticated, redirect to home
router.get('/', (request, response, next)=>{
  if (! request.session.user) {
    return response.redirect('/');
  } else {
    next()
  }
})

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
