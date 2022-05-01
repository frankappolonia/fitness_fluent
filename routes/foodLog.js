const express = require("express");
const router = express.Router();
const data = require("../data");
const foodFunctions = data.foodFuncs;
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
    let food = await foodFunctions.getFoodsByDate(id, dateString);
    response.status(200).render("pages/food", {
      food: food,
      date: dateString,
      script: "/public/js/foodLog.js",
    });
  } catch (e) {
    console.error(e);
    response.status(404).json("404: Page cannot be found");
  }
});

router.route("/").post(async (request, response) => {
  try {
    let { date, food, calories } = request.body;
    let id = request.session.user;
    // error checking

    await foodFunctions.addFoodEntry(id, date, food, calories);
    response.status(200);
  } catch (e) {
    console.log(e);
    response.status(400).send();
  }
});

    
    await foodFunctions.addFoodEntry(
      "email@email.com",
      date,
      food,
      calories
    );
    response.sendStatus(200);
  } catch (e) {
    console.log(e);
    response.status(400).send();
  }
});
module.exports = router;
