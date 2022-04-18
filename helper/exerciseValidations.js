function minutesValidation(minutes) {
  if (typeof minutes !== "number") {
    throw "Minutes must be a number.";
  }
  if (minutes < 1 || minutes > 1440) {
    throw "Enter valid number of minutes.";
  }
}

module.exports = {
  minutesValidation,
};
