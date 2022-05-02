const express = require("express");
const router = express.Router();
const data = require("../data");
const exerciseFunctions = data.exerciseFuncs;
const moment = require("moment");

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
    let exercise = await exerciseFunctions.getExercisesByDate(id, dateString);
    response.status(200).render("pages/exercise", {
      exercise: exercise,
      date: dateString,
      script: "/public/js/exerciseLog.js",
    });
  } catch (e) {
    console.error(e);
    response.status(404).json("404: Page cannot be found");
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
