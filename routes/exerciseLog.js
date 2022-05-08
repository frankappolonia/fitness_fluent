const express = require("express");
const router = express.Router();
const data = require("../data");
const userFuncs = data.userFuncs
const exerciseFunctions = data.exerciseFoodFuncs;
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
    let nutrients = await userFuncs.getRemainingCalories(xss(id))
    authObj = {...authObj, ...nutrients}
    authObj['css'] = "/public/css/foodlog.css"
    //---------------------------------------
    //db call
    let exercise = await exerciseFunctions.getExercisesByDate(xss(id), xss(dateString));
    let totalCalories = await exerciseFunctions.calculateDailyExerciseCalories(xss(id), xss(dateString));
    response.status(200).render("pages/exercise", {
      exercise: exercise,
      date: dateString,
      exerciseCals: totalCalories,
      script: "/public/js/exerciseLog.js",
      script2: "/public/js/filler.js",
      ...authObj
    });

  } catch (e) {
    response.status(400).render("partials/badExercise", {error: e});
  }
});

router.route("/:date").post(async (request, response) => {
  try {
    //validations
    let id = validations.checkId(request.session.user)
    validations.exercisePostRouteValidation(request.body)
    let { date, exercise, calories } = request.body;

    //db call
    await exerciseFunctions.addExercise(xss(id), xss(date), xss(exercise), xss(parseInt(calories)));
    response.status(200).redirect("/exercise-log");

  } catch (e) {
    response.status(400).render('partials/badExercise', {error: e});
  }
});

router.route("/:date").delete(async (request, response) => {
  //need validations still
  try {
    //validations
    let id = validations.checkId(request.session.user);
    validations.deleteFoodExerciseRouteValidation(request.body)
    
    let date = "";
    if (! request.params.date)
      date = moment().format("YYYY-MM-DD");
    else {
      validations.exerciseFoodLogDateValidation(request.params.date)
      date = moment(request.params.date).format("YYYY-MM-DD");
    }
    let sanatizedExercise = {exerciseName: xss(request.body.exerciseName), calories: parseInt(xss(request.body.calories))}
    
    //db call
    await exerciseFunctions.removeExercise(xss(id), xss(date), sanatizedExercise);
    response.sendStatus(200);
  } catch (e) {
    response.status(400).render('errros/400', {error: e});
  }
});



router.route("/calories/:date").get(async (request, response) => {
  try {
    //validations
    validations.exerciseFoodLogDateValidation(request.params.date);
    let date = moment(request.params.date).format("YYYY-MM-DD");

    let id = validations.checkId(request.session.user);
    
    //db call
    let totalCalories = await exerciseFunctions.calculateDailyExerciseCalories(xss(id), xss(date));
    response.status(200).json(totalCalories);
    
  } catch (e) {
 
    response.status(400).render('partials/badExercise', {error: e});
  }
})

module.exports = router;
