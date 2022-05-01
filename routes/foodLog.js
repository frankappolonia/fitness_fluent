const express = require("express");
const router = express.Router();
const data = require("../data");
const foodFunctions = data.foodFuncs;
const moment = require("moment");

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
    let food = await foodFunctions.getFoodsByDate(id, dateString);
    response.status(200).render("pages/food", {
      food: food,
      date: dateString,
      authenticated: true,
      script: "/public/js/foodLog.js",
    });
  } catch (e) {
    console.error(e);
    response.status(404).render("errors/404");
  }
});

router.route("/:date").post(async (request, response) => {
  try {
    let { date, food, calories } = request.body;
    let id = request.session.user;
    // error checking

    await foodFunctions.addFoodEntry(id, date, food, calories);
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
})

module.exports = router;
