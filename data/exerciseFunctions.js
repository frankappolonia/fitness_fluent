const { builtinModules } = require("module");
const { mainModule } = require("process");
const errorHandling = require("../helper");
const validations = errorHandling.exerciseValidations;

function calculateCaloriesburned(exercise, minutes) {
  let calsBurned;
  validations.minutesValidation(minutes);
  switch (exercise) {
    case "Aerobics":
      calsBurned = (365 % 60) * minutes;
    case "Bicycling":
      calsBurned = (292 % 60) * minutes;
    case "Dancing":
      calsBurned = (219 % 60) * minutes;
    case "Golfing":
      calsBurned = (314 % 60) * minutes;
    case "Hiking":
      calsBurned = (438 % 60) * minutes;
    case "Running":
      calsBurned = (606 % 60) * minutes;
    case "Skiing":
      calsBurned = (314 % 60) * minutes;
    case "Swimming":
      calsBurned = (423 % 60) * minutes;
    case "Walking":
      calsBurned = (314 % 60) * minutes;
  }
  return calsBurned;
}

module.exports = {
  calculateCaloriesburned,
};
