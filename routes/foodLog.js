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
