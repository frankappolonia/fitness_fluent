const db = require("../config");
const users = db.usersCollection;
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const { ObjectId } = require("mongodb");

async function addFoodEntry(username, date, foodName, calories) {
  // error checking


  const newEntry = { foodName: foodName, calories: calories };
  const usersCollection = await users();
  let user = await usersCollection.findOne({ email: username });
  if (!user) throw "User not found!";
  let foundEntry = false;
  for (foodLog of user.allFoods) {
    if (foodLog.date === date) {
      foodLog.foods.push(newEntry);
      foundEntry = true;
      await usersCollection.updateOne(
        { email: username, "allFoods.date": date },
        { $set: { "allFoods.$.foods": foodLog.foods } }
      );
    }
  }
  if (!foundEntry) {
    let foodEntry = { _id: new ObjectId(), date: date, foods: [newEntry] };
    await usersCollection.updateOne(
      { email: username },
      { $push: { allFoods: foodEntry } }
    );
  }
  return newEntry;
}

module.exports = {
  addFoodEntry,
};
