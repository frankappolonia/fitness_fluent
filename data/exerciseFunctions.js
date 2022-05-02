const db = require("../config");
const users = db.usersCollection;
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const { ObjectId } = require("mongodb");

async function addExercise(id, date, exerciseName, calories) {
  // error checking
  id = ObjectId(id);
  const newEntry = { exerciseName: exerciseName, calories: calories };
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw "User not found!";
  let foundEntry = false;
  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date === date) {
      exerciseLog.exercises.push(newEntry);
      foundEntry = true;
      await usersCollection.updateOne(
        { _id: id, "allExercises.date": date },
        { $set: { "allExercises.$.exercises": exerciseLog.exercises } }
      );
    }
  }
  if (!foundEntry) {
    let exerciseEntry = {
      _id: new ObjectId(),
      date: date,
      exercises: [newEntry],
    };
    await usersCollection.updateOne(
      { _id: id },
      { $push: { allExercises: exerciseEntry } }
    );
  }
  return newEntry;
}

async function getExercisesByDate(id, dateString) {
  id = ObjectId(id);
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw `User not found! ${id}`;
  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date == dateString) {
      return exerciseLog.exercises;
    }
  }
  return [];
}

async function removeExercise(id, date, exerciseEntry) {
  id = ObjectId(id);
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw "User not found!";
  let foundEntry = false;
  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date === date) {
      foundEntry = true;
      for (exercise of exerciseLog.exercises) {
        if (
          exercise.exerciseName == exerciseEntry.exerciseName &&
          exercise.calories == exerciseEntry.calories
        ) {
          exerciseLog.exercises.splice(
            exerciseLog.exercises.indexOf(exercise),
            1
          );
        }
      }
      await usersCollection.updateOne(
        { _id: id, "allExercises.date": date },
        { $set: { "allExercises.$.exercises": exerciseLog.exercises } }
      );
    }
  }
  if (!foundEntry) {
    throw "Exercise entry not found!";
  }
}

async function calculateDailyExerciseCalories(id, dateString) {
  // remove dailyCaloriesRemaining field in document
  id = ObjectId(id);
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw "User not found!";
  let totalCalories = 0;
  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date === dateString) {
      for (exercise of exerciseLog.exercises) {
        totalCalories += exercise.calories;
      }
    }
  }
  return totalCalories;
}

module.exports = {
  addExercise,
  getExercisesByDate,
  removeExercise,
  calculateDailyExerciseCalories,
};
