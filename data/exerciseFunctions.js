const db = require("../config");
const users = db.usersCollection;
const { ObjectId } = require('mongodb');
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const userFuncs = require('./users')
const moment = require("moment");
const food = require('./foodFunctions')


async function addExercise(id, date, exerciseName, calories) {

  //1. validations
  if (arguments.length !== 4) throw "Invalid number of arguments"
  validations.stringChecks([id, date, exerciseName])
  validations.stringtrim(arguments)
  validations.checkCalories(calories)
  id = validations.checkId(id)
  validations.exerciseFoodLogDateValidation(date)

  const newEntry = { exerciseName: exerciseName, calories: parseInt(calories) };
  const usersCollection = await users();
  
  let user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found!";

  let foundEntry = false;

  //if there is already exercises logged for this date
  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date === date) {
      exerciseLog.exercises.push(newEntry);
      foundEntry = true;
      await usersCollection.updateOne(
        { _id: ObjectId(id), "allExercises.date": date },
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
      { _id: ObjectId(id) },
      { $push: { allExercises: exerciseEntry } }
    );
  }

  //check if date is current date, and if so, update daily calories remaining
  let currentDate = new Date()
   
  if (moment(date).format('YYYY-MM-DD') == moment(currentDate).format('YYYY-MM-DD')){
    let foodCals = await food.calculateDailyFoodCalories(id, date)
    let exerciseCals = await calculateDailyExerciseCalories(id, date)
    await userFuncs.calculateDailyCaloriesRemaining(id, date, foodCals, exerciseCals)
    return newEntry
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
  validations.stringChecks([id, date, exerciseEntry.exerciseName])
  validations.stringtrim(arguments)
  id = validations.checkId(id)
  validations.exerciseFoodLogDateValidation(date)
  validations.checkCalories(exerciseEntry.calories)

  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found!";


  let foundEntry = false;
  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date === date) {
      foundEntry = true;

      for (exercise of exerciseLog.exercises) {
        if (exercise.exerciseName == exerciseEntry.exerciseName && exercise.calories == parseInt(exerciseEntry.calories)) {
            exerciseLog.exercises.splice(exerciseLog.exercises.indexOf(exercise),1);
            break;
        }
      }
      await usersCollection.updateOne(
        { _id: ObjectId(id), "allExercises.date": date },
        { $set: { "allExercises.$.exercises": exerciseLog.exercises } }
      );
    
    }
  }
  
  if (!foundEntry) {
    throw "Exercise entry not found!";
  }
  

   //check if date is current date, and if so, update daily calories remaining
   let currentDate = new Date()
   if (moment(date).format('YYYY-MM-DD') == moment(currentDate).format('YYYY-MM-DD')){
     let foodCals = await food.calculateDailyFoodCalories(id, date)
     let exerciseCals = await calculateDailyExerciseCalories(id, date)
     await userFuncs.calculateDailyCaloriesRemaining(id, date, foodCals, exerciseCals)
   }
}

async function calculateDailyExerciseCalories(id, currentDate) {
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

  //3. get the exercies
  let exercises = await getExercisesByDate(id, currentDate)
  if(exercises.length === 0) return 0 //if there are no exerices, then 0 calories were burned

  //4. calculate the total calories burned
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
