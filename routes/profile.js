const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const errorHandling = require("../helper");
const foodExFuncs = db.exerciseFoodFuncs
const validations = errorHandling.userValidations;
const xss = require("xss");

//if the user is NOT authenticated, redirect to home
router.get("/", (request, response, next) => {
  if (!request.session.user) {
    return response.redirect("/");
  } else {
    next();
  }
})

router.get("/editProfile", (request, response, next) => {
  if (!request.session.user) {
    return response.redirect("/");
  } else {
    next();
  }
});

router.route("/")
  .get(async (request, response) => {
  try {
    let authObj = {};
    //validations
    let id = validations.checkId(request.session.user);

    //stuff for daily goals widget
    authObj.authenticated = true;
    let nutrients = await userFuncs.getRemainingCalories(id);
    authObj = { ...authObj, ...nutrients };
    //---------------------------------------


    let user = await userFuncs.getUserById(xss(id));
    let firstName = user.firstName;
    let lastName = user.lastName;
    validations.nameValidation(firstName, lastName);
    let email = user.email;
    let dob = user.dob;
    let bmr = user.BMR
    let bmi = user.BMI
    let activityLevel = user.activityLevel.trim().toLowerCase();
    let weeklyWeightGoal = user.weeklyWeightGoal
    let height = user.height;
    let calorieGoal = user.totalDailyCalories

    let allWeights = await userFuncs.getAllWeights(xss(id));
    let currentWeight = allWeights.weights[allWeights.weights.length - 1];

    response.status(200).render("pages/profile", {
      script: "/public/js/profile.js",
      css: "/public/css/profile.css",
      firstName,
      lastName,
      email,
      dob,
      activityLevel,
      weeklyWeightGoal,
      height,
      currentWeight,
      bmr: bmr,
      bmi: bmi,
      calorieGoal: calorieGoal,
      ...authObj,
    });
  } catch (e) {
    console.log(e);
    response.status(400).render("errors/400", { error: e });
  }
  })
  .post(async(request, response) =>{

    try {
      let id = validations.checkId(request.session.user);
      validations.heightWeightValidation(60, request.body.weight)
      let weight = request.body.weight

      await foodExFuncs.logCurrentWeight(xss(id), xss(weight), xss("current"))
      response.status(200).redirect("/profile")
      
    } catch (e) {
      response.status(400).render("errors/400", {error: e});
      
    }

  });

router.route("/editProfile")
  .get(async (request, response) => {
    try {
      if (!request.session.user) {
        response.redirect("/");
        return;
      }
      let authObj = {};
      //validations
      let id = validations.checkId(request.session.user);

      //stuff for daily goals widget
      authObj.authenticated = true;
      let nutrients = await userFuncs.getRemainingCalories(xss(id));
      authObj = { ...authObj, ...nutrients };
      //---------------------------------------

      let user = await userFuncs.getUserById(xss(id));
      let firstName = user.firstName;
      let lastName = user.lastName;
      let activityLevel = user.activityLevel.trim().toLowerCase();
      let weeklyWeightGoal = user.weeklyWeightGoal;
      let height = user.height;

      validations.nameValidation(firstName, lastName);
      validations.activityLevelValidation(activityLevel);
      validations.weeklyGoalValidation(weeklyWeightGoal);
      validations.heightWeightValidation(height, 60);

      response.status(200).render("pages/editProfile", {
        script: "/public/js/profile.js",
        css: "/public/css/editProfile.css",
        firstName,
        lastName,
        activityLevel,
        weeklyWeightGoal,
        height,
        ...authObj,
      });
      } catch (e) {
        response.status(400).render("errors/400", { error: e });
      }
    })
    .patch(async (request, response) => {
    try {
      //validations
      let id = validations.checkId(request.session.user);
      validations.validateProfilePatch(request.body)
      const {firstName, lastName, height, activityLevel, goal} = request.body

      await foodExFuncs.updateUser(
        xss(id),
        xss(firstName),
        xss(lastName),
        xss(height),
        xss(activityLevel),
        xss(goal)
      );

      console.log('here2')
      response.status(200).send('Success');
    } catch (e) {
      response.status(400).send("error: " + e);
    }
});

router.route("/updateMacros")
  .post(async(request, response) =>{

    try {
      let id = validations.checkId(request.session.user)
      validations.checkMacroGoalPostRoute(request.body)

      let carbs = request.body.carbs
      let fat = request.body.fat
      let protein = request.body.protein

      await userFuncs.updateMacros(id, carbs, protein, fat)
      response.status(200).redirect('/profile')

        
    } catch (e) {
      response.status(400).render('errors/400', {error: e})
    
    }

  });

module.exports = router;
