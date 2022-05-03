const db = require("../config");
const users = db.usersCollection;
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const { ObjectId } = require("mongodb");

async function addFoodEntry(id, date, foodName, calories) {
  // error checking
  id = ObjectId(id);
  const newEntry = { foodName: foodName, calories: calories };
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw "User not found!";
  let foundEntry = false;
  for (foodLog of user.allFoods) {
    if (foodLog.date === date) {
      foodLog.foods.push(newEntry);
      foundEntry = true;
      await usersCollection.updateOne(
        { _id: id, "allFoods.date": date },
        { $set: { "allFoods.$.foods": foodLog.foods } }
      );
    }
  }
  if (!foundEntry) {
    let foodEntry = { _id: new ObjectId(), date: date, foods: [newEntry] };
    await usersCollection.updateOne(
      { _id: id },
      { $push: { allFoods: foodEntry } }
    );
  }
  return newEntry;
}

async function getFoodsByDate(id, dateString) {
  id = ObjectId(id);
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw `User not found! ${id}`;
  for (foodLog of user.allFoods) {
    if (foodLog.date == dateString) {
      return foodLog.foods;
    }
  }
  return [];
}

async function removeFoodEntry(id, date, foodEntry) {
  id = ObjectId(id);
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw "User not found!";
  let foundEntry = false;
  for (foodLog of user.allFoods) {
    if (foodLog.date === date) {
      foundEntry = true;
      for (food of foodLog.foods) {
        if (
          food.foodName == foodEntry.foodName &&
          food.calories == foodEntry.calories
        ) {
          foodLog.foods.splice(foodLog.foods.indexOf(food), 1);
        }
      }
      await usersCollection.updateOne(
        { _id: id, "allFoods.date": date },
        { $set: { "allFoods.$.foods": foodLog.foods } }
      );
    }
  }
  if (!foundEntry) {
    throw "Food entry not found!";
  }
}

async function calculateDailyFoodCalories(id, currentDate) {
    //1. validations
    if(arguments.length !== 2) throw "Invalid number of argumets"
    validations.stringChecks([id, currentDate])
    validations.stringtrim(arguments)
    id = validations.checkId(id)
    validations.exerciseFoodLogDateValidation(currentDate)
  
    //2. check if the user exists
    const usersCollection = await users();
    let user = await usersCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw "User not found!";
  
    //3. get the food
    let foods = await getFoodsByDate(id, currentDate)
    if(foods.length === 0) return 0 //if there are no foods, then 0 calories were burned
  
    //4. calculate the total calories burned
    let caloriesEaten = 0
    foods.forEach(foodObj => {
      caloriesEaten += foodObj.calories
      })
  
    return caloriesEaten;
  }

module.exports = {
  addFoodEntry,
  getFoodsByDate,
  removeFoodEntry,
  calculateDailyFoodCalories,
};
