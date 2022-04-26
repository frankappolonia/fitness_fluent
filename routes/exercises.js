const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const xss = require("xss");
const errorHandling = require('../helper')
const validations = errorHandling.userValidations

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
    let id = validations.checkId(request.session.user)
    authObj.authenticated = true;
    let cals = await userFuncs.getRemainingCalories(id);
    authObj["calories"] = cals;
    
    response.status(200).render("pages/exercises", authObj);
    
  } catch (e) {
    response.status(404).json("404: Page cannot be found");
  }
});
module.exports = router;
