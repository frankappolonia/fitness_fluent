const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const profileFuncs = db.profileFuncs;
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const xss = require("xss");

//if the user is NOT authenticated, redirect to home
router.get("/", (request, response, next) => {
  if (!request.session.user) {
    return response.redirect("/");
  } else {
    next();
  }
});

router.route("/").get(async (request, response) => {
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
    // validations.dobValidation(dob);
    let activityLevel = user.activityLevel.trim().toLowerCase();
    validations.activityLevelValidation(activityLevel);
    let weeklyWeightGoal = user.weeklyWeightGoal;
    validations.weeklyGoalValidation(weeklyWeightGoal);
    let height = user.height;
    let allWeights = await userFuncs.getAllWeights(id);
    let currentWeight = allWeights.weights[allWeights.weights.length - 1];
    validations.heightWeightValidation(height, currentWeight);

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
      ...authObj,
    });
  } catch (e) {
    console.log(e);
    response.status(400).render("errors/400", { error: e });
  }
});

router.route("/editProfile").get(async (request, response) => {
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
    let nutrients = await userFuncs.getRemainingCalories(id);
    authObj = { ...authObj, ...nutrients };
    //---------------------------------------

    let user = await userFuncs.getUserById(xss(id));
    let firstName = user.firstName;
    let lastName = user.lastName;
    validations.nameValidation(firstName, lastName);
    let activityLevel = user.activityLevel.trim().toLowerCase();
    validations.activityLevelValidation(activityLevel);
    let weeklyWeightGoal = user.weeklyWeightGoal;
    validations.weeklyGoalValidation(weeklyWeightGoal);
    let height = user.height;
    let allWeights = await userFuncs.getAllWeights(id);
    let currentWeight = allWeights.weights[allWeights.weights.length - 1];
    validations.heightWeightValidation(height, currentWeight);

    response.status(200).render("pages/editProfile", {
      script: "/public/js/profile.js",
      css: "/public/css/editProfile.css",
      firstName,
      lastName,
      activityLevel,
      weeklyWeightGoal,
      height,
      currentWeight,
      ...authObj,
    });
  } catch (e) {
    response.status(400).render("errors/400", { error: e });
  }
});

router.route("/updateProfile").patch(async (request, response) => {
  try {
    let authObj = {};
    //validations
    let id = validations.checkId(request.session.user);

    let firstName = request.body.newFirstName;
    let lastName = request.body.newLastName;
    firstName = firstName.trim();
    lastName = lastName.trim();
    validations.stringChecks([firstName, lastName]);
    validations.nameValidation(firstName, lastName);

    let activityLevel = request.body.newActivityLevel;
    activityLevel = activityLevel.trim().toLowerCase();
    validations.stringChecks([activityLevel]);
    validations.activityLevelValidation(activityLevel);

    let goal = request.body.newGoal;
    validations.weeklyGoalValidation(goal);

    let height = request.body.newHeight;
    let weight = request.body.newWeight;
    validations.heightWeightValidation(height, weight);

    await userFuncs.updateUser(
      id,
      firstName,
      lastName,
      height,
      weight,
      activityLevel,
      goal
    );
    response.status(200).redirect("/");
  } catch (e) {
    console.log(e);
    response.status(400).render("errors/400", { error: e });
  }
});

// router.route("/updateActivityLevel").patch(async (request, response) => {
//     try {
//         let authObj = {};
//         //validations
//         let id = validations.checkId(request.session.user);

//         let activityLevel = request.body.newActivityLevel;
//         activityLevel = activityLevel.trim();
//         validations.stringChecks([activityLevel]);
//         validations.activityLevelValidation(activityLevel);

//         profileFuncs.updateActivityLevel(id, activityLevel);

//         response.status(200).redirect("/");
//     } catch (e) {
//         response.status(400).render("errors/400", { error: e });
//     }
// })

// router.route("/updateWeeklyWeightGoal").patch(async (request, response) => {
//     try {
//         let authObj = {};
//         //validations
//         let id = validations.checkId(request.session.user);

//         let goal = request.body.newGoal;
//         validations.weeklyGoalValidation(goal);

//         profileFuncs.updateWeeklyWeightGoal(id, goal);

//         response.status(200).redirect("/");
//     } catch (e) {
//         response.status(400).render("errors/400", { error: e });
//     }
// })

// router.route("/updateHeight").patch(async (request, response) => {
//     try {
//         let authObj = {};
//         //validations
//         let id = validations.checkId(request.session.user);

//         let height = request.body.newHeight;
//         let placeholderWeight = 100;
//         validations.heightWeightValidation(height, placeholderWeight);

//         profileFuncs.updateHeight(id, height);

//         response.status(200).redirect("/");
//     } catch (e) {
//         response.status(400).render("errors/400", { error: e });
//     }
// })

// router.route("/updateWeight").patch(async (request, response) => {
//     try {
//         let authObj = {};
//         //validations
//         let id = validations.checkId(request.session.user);

//         let weight = request.body.newWeight;
//         let placeholderHeight = 60;
//         validations.heightWeightValidation(placeholderHeight, weight);

//         profileFuncs.updateWeight(id, weight);

//         response.status(200).redirect("/");
//     } catch (e) {
//         response.status(400).render("errors/400", { error: e });
//     }
// })

module.exports = router;
