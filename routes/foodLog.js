const express = require("express");
const router = express.Router();
const data = require("../data");
const foodFunctions = data.exerciseFoodFuncs;
const userFuncs = data.userFuncs;
const axios = require("axios");
const moment = require("moment");

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
    let date = moment(request.params.date);
    let dateString = "";
    if (!date) {
      dateString = moment().format("YYYY-MM-DD");
    } else {
      dateString = moment(date).format("YYYY-MM-DD");
    }
    let id = request.session.user;
    if (!id) {
      throw "User not found!";
    }

    //stuff for daily goals widget
    let authObj = {};
    authObj.authenticated = true;
    let nutrients = await userFuncs.getRemainingCalories(id);
    authObj = { ...authObj, ...nutrients };
    authObj["css"] = "/public/css/forum_styles.css";
    //---------------------------------------

    let food = await foodFunctions.getFoodsByDate(id, dateString);
    console.log({
      food: food,
      date: dateString,
      script: "/public/js/foodLog.js",
      ...authObj,
    });
    response.status(200).render("pages/food", {
      food: food,
      date: dateString,
      script: "/public/js/foodLog.js",
      ...authObj,
    });
  } catch (e) {
    console.error(e);
    response.status(404).render("errors/404");
  }
});

router.route("/:date").post(async (request, response) => {
  try {
    let { date, food, calories, protein, carbs, fat } = request.body;
    let id = request.session.user;
    // error checking

    await foodFunctions.addFoodEntry(
      id,
      date,
      food,
      parseInt(calories),
      parseInt(protein),
      parseInt(carbs),
      parseInt(fat)
    );
    response.status(200).redirect("/food-log");
  } catch (e) {
    console.error(e);
    response.status(400).send();
  }
});

router.route("/:date").delete(async (request, response) => {
  try {
    let date = request.params.date;
    let food = request.body;
    let id = request.session.user;
    // error checking
    await foodFunctions.removeFoodEntry(id, date, food);
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
    let cals = await foodFunctions.calculateDailyFoodCalories(id, date);
    response.status(200).json(cals);
  } catch (e) {
    console.error(e);
    response.status(400).send();
  }
});

router.route("/search/:term").get(async (request, response) => {
  try {
    let food = request.params.term;
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
    console.error(e);
    response.status(400).send();
  }
});

module.exports = router;
