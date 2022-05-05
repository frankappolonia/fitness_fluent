const express = require("express");
const router = express.Router();
const data = require("../data");
const foodFunctions = data.exerciseFoodFuncs;
const userFuncs = data.userFuncs;
const axios = require("axios");
const moment = require("moment");
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
router.get("/:date?", (request, response, next) => {
  if (!request.session.user) {
    return response.redirect("/");
  } else {
    next();
  }
});

//---------------------------------------------------------------------

router.route("/:date?").get(async (request, response) => {
  try {
    //validations
    let id = validations.checkId(request.session.user);
    let date = request.params.date;
    let dateString = "";

    if (!date) {
      dateString = moment().format("YYYY-MM-DD");
    } else {
      validations.exerciseFoodLogDateValidation(request.params.date);
      dateString = moment(date).format("YYYY-MM-DD");
    }

    //stuff for daily goals widget
    let authObj = {};
    authObj.authenticated = true;
    let nutrients = await userFuncs.getRemainingCalories(id);
    authObj = { ...authObj, ...nutrients };
    let recommendations = await foodFunctions.getRecommendations(
      nutrients.calories
    );
    //---------------------------------------

    let food = await foodFunctions.getFoodsByDate(xss(id), xss(dateString));

    response.status(200).render("pages/food", {
      food: food,
      date: dateString,
      script: "/public/js/foodLog.js",
      css: "/public/css/foodlog.css",
      ...authObj,
      recommendations: recommendations,
    });
  } catch (e) {
    response.status(400).render("errors/400", { error: e });
  }
});

router.route("/:date").post(async (request, response) => {
  try {
    //validations
    let id = validations.checkId(request.session.user);
    validations.postRouteCheckFood(request.body);

    let { date, food, calories, protein, carbs, fat } = request.body;

    await foodFunctions.addFoodEntry(
      xss(id),
      xss(date),
      xss(food),
      parseInt(xss(calories)),
      parseInt(xss(protein)),
      parseInt(xss(carbs)),
      parseInt(xss(fat))
    );
    response.status(200).redirect("/food-log");
  } catch (e) {
    response.status(400).render("errors/400", { error: e });
  }
});

router.route("/:date").delete(async (request, response) => {
  try {
    //validations
    let id = validations.checkId(request.session.user)
    validations.exerciseFoodLogDateValidation(request.params.date)
    let date = request.params.date;

    let food = request.body;
    validations.deleteRouteCheckFood(food, date)
    
    // sanataize contents of object
    let sanataizedFood = {foodName: xss(food.foodName), calories: xss(food.calories), protein: xss(food.protein), carbs: xss(food.carbs), fat: xss(food.fat) }

    await foodFunctions.removeFoodEntry(xss(id), xss(date), sanataizedFood);
    response.sendStatus(200);
  } catch (e) {
    response.status(400).render('errors/400', {error: e});
  }
});

router.route("/calories/:date").get(async (request, response) => {
  try {
    //validations
    let id = validations.checkId(request.session.user);
    validations.exerciseFoodLogDateValidation(request.params.date);

    let date = moment(request.params.date).format("YYYY-MM-DD");

    let cals = await foodFunctions.calculateDailyFoodCalories(
      xss(id),
      xss(date)
    );

    response.status(200).json(cals);
  } catch (e) {
    response.status(400).render("errors/400", { error: e });
  }
});

router.route("/search/:term").get(async (request, response) => {
  try {
    //validations
    validations.stringChecks([request.params.term]);

    let food = xss(request.params.term);
    const options = {
      method: "GET",
      url: "https://edamam-food-and-grocery-database.p.rapidapi.com/parser",
      params: { ingr: food },
      headers: {
        "X-RapidAPI-Host": "edamam-food-and-grocery-database.p.rapidapi.com",
        "X-RapidAPI-Key": "e15ac27b41msh078c9a4ba21df70p1b9e03jsna2a33f434dd6",
      },
    };

    let { data } = await axios.request(options);
    let results = data.hints;
    response.status(200).json(results);
  } catch (e) {
    response.status(400).render('errors/404');
  }
});

module.exports = router;
