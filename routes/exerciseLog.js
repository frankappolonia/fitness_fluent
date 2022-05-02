const express = require("express");
const router = express.Router();
const data = require("../data");
const userFuncs = data.userFuncs
const exerciseFunctions = data.exerciseFuncs;
const moment = require("moment");
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const xss = require('xss');



//if the user is NOT authenticated, redirect to home
router.get('/', (request, response, next)=>{
  if (! request.session.user) {
    return response.redirect('/');
  } else {
    next()
  }
});
router.get('/:date?', (request, response, next)=>{
  if (! request.session.user) {
    return response.redirect('/');
  } else {
    next()
  }
});
//-------------------------------------------------------------


router.route("/:date?").get(async (request, response) => {
  try {

    //validations
    let id = validations.checkId(request.session.user)
    let date = (request.params.date);
    let dateString = "";
    if (!date)
      dateString = moment().format("YYYY-MM-DD");
    else {
      validations.exerciseFoodLogDateValidation(request.params.date)
      dateString = moment(date).format("YYYY-MM-DD");
    }
            
    //stuff for daily goals widget
    let authObj = {}
    authObj.authenticated = true        
    let cals = await userFuncs.getRemainingCalories(id)
    authObj['calories'] = cals
    authObj['css'] = "/public/css/forum_styles.css"
    //---------------------------------------

    //db call
    let exercise = await exerciseFunctions.getExercisesByDate(xss(id), xss(dateString));
    response.status(200).render("pages/exercise", {
      exercise: exercise,
      date: dateString,
      script: "/public/js/exerciseLog.js",
      ...authObj
    });

  } catch (e) {
    response.status(400).render("partials/badExerciseDate", {error: e});
  }
});

router.route("/:date").post(async (request, response) => {
  try {
    let { date, exercise, calories } = request.body;
    let id = request.session.user;
    // error checking
    await exerciseFunctions.addExercise(id, date, exercise, calories);
    response.status(200).redirect("/exercise-log");
  } catch (e) {
    console.error(e);
    response.status(400).send();
  }
});

router.route("/:date").delete(async (request, response) => {
  try {
    let date = request.params.date;
    let exercise = request.body;
    let id = request.session.user;
    // error checking
    await exerciseFunctions.removeExercise(id, date, exercise);
    response.sendStatus(200);
  } catch (e) {
    console.error(e);
    response.status(400).send();
  }
});

router.route("/calories/:date").get(async (request, response) => {
  try {
    let date = request.params.date;
    let id = request.session.user;
    if (!id) {
      throw "User not found!";
    }
    let cals = await exerciseFunctions.calculateDailyExerciseCalories(id, date);
    response.status(200).json(cals);
  } catch (e) {
    console.error(e);
    response.status(400).send();
  }
})

module.exports = router;
