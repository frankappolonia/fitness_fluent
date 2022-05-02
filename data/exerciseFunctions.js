const db = require("../config");
const users = db.usersCollection;
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const { ObjectId } = require("mongodb");

async function addExercise(id, date, exerciseName, calories) {

  //1. validations
  if (arguments.length !== 4) throw "Invalid number of arguments"
  validations.stringChecks([id, date, exerciseName])
  validations.stringtrim(arguments)
  validations.checkCalories(calories)
  id = validations.checkId(id)
  validations.exerciseFoodLogDateValidation(date)

  id = ObjectId(id);
  const newEntry = { exerciseName: exerciseName, calories: parseInt(calories) };
  const usersCollection = await users();

  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw "User not found!";

  let foundEntry = false;

  //if there is already exercises logged for this date
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

  //if there is no exercises logged yet for that date
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

  //1. validaitons
  if(arguments.length !== 2) throw "Invalid number of arguments"
  validations.stringChecks([id, dateString])
  validations.stringtrim(arguments)
  id = validations.checkId(id)
  validations.exerciseFoodLogDateValidation(dateString)


  id = ObjectId(id);
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw `User not found! ${id}`;

  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date == dateString) {
      return exerciseLog.exercises; //returns all of the exericse objects
    } 
  }
  return [];
}

async function removeExercise(id, date, exerciseEntry) {

  //1. validations 
  if(arguments.length !== 3) throw "Invalid number of arguments"
  validations.stringChecks([id, date, exerciseEntry])
  validations.stringtrim(arguments)
  id = validations.checkId(id)
  validations.exerciseFoodLogDateValidation(date)

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

async function calculateDailyExerciseCalories(id, currentDate) {
  //1. validations
  if(arguments.length !== 2) throw "Invalid number of argumets"
  validations.stringChecks([id, currentDate])
  validations.stringtrim(arguments)
  id = validations.checkId(id)
  validations.exerciseFoodLogDateValidation(currentDate)

  //2. get the exercises from the current date (if any)
  id = ObjectId(id);
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: id });
  if (!user) throw "User not found!";

  let exercises = getExercisesByDate(id, currentDate)
  if(exercises.length === 0) return 0 //if there are no exerices, then 0 calories were burned

  //3. calculate the total calories burned
  let caloriesBurned = 0
  exercises.forEach(exerciseObj => {
    caloriesBurned += exerciseObj.calories
    })

  return caloriesBurned;
}


module.exports = {
  addExercise,
  getExercisesByDate,
  removeExercise,
  calculateDailyExerciseCalories,
};
