const express = require("express");
const router = express.Router();
const data = require("../data");
const foodFunctions = data.foodFuncs;

router.route("/").get(async (request, response) => {
  try {
    response.status(200).render("pages/food");
  } catch (e) {
    response.status(404).json("404: Page cannot be found");
  }
});

router.route("/").post(async (request, response) => {
  try {
    let { date, food, calories } = request.body;

    // error checking


    
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
