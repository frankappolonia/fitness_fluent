const db = require("../config");
const users = db.usersCollection;
const errorHandling = require("../helper");
const validations = require("../helper/exerciseValidations");
// const validations = errorHandling.exerciseValidations;
const userFuncs = require("./users");
const exerciseFuncs = require("./exerciseFunctions");
const { ObjectId } = require("mongodb");

async function addExercise(name, calories, id) {
  if (arguments.length !== 3) {
    throw "Incorrect number of arguments!";
  }
  let currId = new ObjectId(id);
  //validations.checkExercise(name);
  //validations.checkCalories(calories);
  const usersCollection = await users();
  const addingExercise = await usersCollection.updateOne(
    { _id: currId },
    {
      $push: {
        allExercises: {
          name: exercisename,
          calories: calories,
        },
      },
    }
  );
  if (!addingExercise.modifiedCount) {
    throw "Could not add exercise !!!";
  }
  return addingExercise;
}
async function getAllExercises(id){
    let currId = new ObjectId(id);
    const usersCollection = await users();
    const data = await usersCollection.findOne({ _id: currId });
    console.log("hello");
    console.log(data);
    let everyExercise = data.allExercises;
    return everyExercise
}

module.exports = {
  addExercise,
  getAllExercises
};
