const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const exerciseFuncs = db.exerciseFuncs;
const xss = require("xss");
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const { response } = require("express");

//if the user is NOT authenticated, redirect to home
router.get("/", (request, response, next) => {
  if (!request.session.user) {
    return response.redirect("/");
  } else {
    next();
  }
});

router.route("/").get(async (request, response) => {
  let authObj = {};
  try {
    let id = validations.checkId(request.session.user);

    //stuff for daily goals widget
    authObj.authenticated = true        
    let cals = await userFuncs.getRemainingCalories(id)
    authObj['calories'] = cals
    //---------------------------------------authObj.authenticated = true;

    let allExercises = await exerciseFuncs.getAllExercises(id);
    authObj["allExercises"] = allExercises;
    response.status(200).render("pages/exerciseHome", authObj);
    
  } catch (e) {
    console.log(e);
    response.status(404).render("errors/404");
  }
});
router.route("/new").post(async (request, response) => {
  let data = request.body;
  try {
    let id = validations.checkId(request.session.user);
    //console.log(id);
    await exerciseFuncs.addExercise(
      xss(data.exercisename),
      xss(data.calories),
      xss(id)
    );
    response.status(200).render("pages/newExercise", data);
  } catch (e) {
    // console.log(e);
    response.status(404).render("errors/404");
  }
});

module.exports = router;
