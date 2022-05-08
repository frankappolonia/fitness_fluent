const db = require("../config");
const users = db.usersCollection;
const { ObjectId } = require("mongodb");
const errorHandling = require("../helper");
const validations = errorHandling.userValidations;
const userFuncs = require("./users");
const moment = require("moment");
const nutritionFuncs = require('./nutritionFunctions')

/*======================================================
                  EXERCISE FUNCTIONS
 ======================================================
    */

async function addExercise(id, date, exerciseName, calories) {
  //1. validations
  if (arguments.length !== 4) throw "Invalid number of arguments";
  validations.stringChecks([id, date, exerciseName]);
  validations.stringtrim(arguments);
  validations.checkCalories(calories);
  id = validations.checkId(id);
  validations.exerciseFoodLogDateValidation(date);

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
  let currentDate = new Date();

  if (
    moment(date).format("YYYY-MM-DD") ==
    moment(currentDate).format("YYYY-MM-DD")
  ) {
    let foodCals = await calculateDailyFoodCalories(id, date);
    let exerciseCals = await calculateDailyExerciseCalories(id, date);
    await userFuncs.calculateDailyCaloriesRemaining(
      id,
      date,
      foodCals,
      exerciseCals
    );

    return newEntry;
  }

  return newEntry;
}

async function getExercisesByDate(id, dateString) {
  //1. validaitons
  if (arguments.length !== 2) throw "Invalid number of arguments";
  validations.stringChecks([id, dateString]);
  validations.stringtrim(arguments);
  id = validations.checkId(id);
  validations.exerciseFoodLogDateValidation(dateString);

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
  if (arguments.length !== 3) throw "Invalid number of arguments";
  if(exerciseEntry.constructor !== Object) throw "exerciseEntry must be an object! "
  validations.stringChecks([id, date, exerciseEntry.exerciseName]);
  validations.stringtrim(arguments);
  id = validations.checkId(id);
  validations.exerciseFoodLogDateValidation(date);
  validations.checkCalories(exerciseEntry.calories);

  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found!";

  let foundEntry = false;
  for (exerciseLog of user.allExercises) {
    if (exerciseLog.date === date) {
      foundEntry = true;

      for (exercise of exerciseLog.exercises) {
        if (
          exercise.exerciseName == exerciseEntry.exerciseName &&
          exercise.calories == parseInt(exerciseEntry.calories)
        ) {
          exerciseLog.exercises.splice(
            exerciseLog.exercises.indexOf(exercise),
            1
          );
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
  let currentDate = new Date();
  if (
    moment(date).format("YYYY-MM-DD") ==
    moment(currentDate).format("YYYY-MM-DD")
  ) {
    let foodCals = await calculateDailyFoodCalories(id, date);
    let exerciseCals = await calculateDailyExerciseCalories(id, date);
    await userFuncs.calculateDailyCaloriesRemaining(
      id,
      date,
      foodCals,
      exerciseCals
    );
  }
}

async function calculateDailyExerciseCalories(id, currentDate) {
  //1. validations
  if (arguments.length !== 2) throw "Invalid number of argumets";
  validations.stringChecks([id, currentDate]);
  validations.stringtrim(arguments);
  id = validations.checkId(id);
  validations.exerciseFoodLogDateValidation(currentDate);

  //2. check if the user exists
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found!";

  //3. get the exercies
  let exercises = await getExercisesByDate(id, currentDate);
  if (exercises.length === 0) return 0; //if there are no exerices, then 0 calories were burned

  //4. calculate the total calories burned
  let caloriesBurned = 0;
  exercises.forEach((exerciseObj) => {
    caloriesBurned += exerciseObj.calories;
  });

  return caloriesBurned;
}

/*======================================================
                  FOOD FUNCTIONS
 ======================================================
    */

async function addFoodEntry(id, date, foodName, calories, protein, carbs, fat) {
  //1. validations
  if (arguments.length !== 7) throw "Invalid number of arguments!";
  id = validations.checkId(id);
  validations.checkNewFood(date, foodName, calories, protein, carbs, fat);

  const newEntry = {
    foodName: foodName.trim(),
    calories: parseInt(calories),
    protein: parseInt(protein),
    carbs: parseInt(carbs),
    fat: parseInt(fat),
  };

  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found!";

  let foundEntry = false;
  for (foodLog of user.allFoods) {
    if (foodLog.date === date) {
      foodLog.foods.push(newEntry);
      foundEntry = true;
      await usersCollection.updateOne(
        { _id: ObjectId(id), "allFoods.date": date },
        { $set: { "allFoods.$.foods": foodLog.foods } }
      );
    }
  }
  if (!foundEntry) {
    let foodEntry = { _id: new ObjectId(), date: date, foods: [newEntry] };
    await usersCollection.updateOne(
      { _id: ObjectId(id) },
      { $push: { allFoods: foodEntry } }
    );
  }

  //check if date is current date, and if so, update daily calories remaining and macros
  let currentDate = new Date();

  if (
    moment(date).format("YYYY-MM-DD") ==
    moment(currentDate).format("YYYY-MM-DD")
  ) {
    //updating calories
    let foodCals = await calculateDailyFoodCalories(id, date);
    let exerciseCals = await calculateDailyExerciseCalories(id, date);

    await userFuncs.calculateDailyCaloriesRemaining(
      id,
      date,
      foodCals,
      exerciseCals
    );

    //updating macros
    let foodsArray = await getFoodsByDate(id, date);
    await userFuncs.calculateDailyMacrosRemaining(id, date, foodsArray);

    return newEntry;
  }

  return newEntry;
}

async function getFoodsByDate(id, dateString) {
  //1. validations
  if (arguments.length !== 2) throw "Invalid number of arguments";
  id = validations.checkId(id);
  validations.exerciseFoodLogDateValidation(dateString);

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
  //1. validations
  if (arguments.length !== 3) throw "invalid number of arguments!";
  id = validations.checkId(id);
  if(foodEntry.constructor !== Object) throw "foodEntry must be an object! "
  validations.checkNewFood(date, foodEntry.foodName, foodEntry.calories, foodEntry.protein, foodEntry.carbs, foodEntry.fat)

  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found!";
  let foundEntry = false;
  for (foodLog of user.allFoods) {
    if (foodLog.date === date) {
      foundEntry = true;
      for (food of foodLog.foods) {
        if (
          food.foodName == foodEntry.foodName &&
          food.calories == foodEntry.calories &&
          food.protein == foodEntry.protein &&
          food.carbs == foodEntry.carbs &&
          food.fat == foodEntry.fat
        ) {
          foodLog.foods.splice(foodLog.foods.indexOf(food), 1);
        }
      }
      await usersCollection.updateOne(
        { _id: ObjectId(id), "allFoods.date": date },
        { $set: { "allFoods.$.foods": foodLog.foods } }
      );
    }
  }
  if (!foundEntry) {
    throw "Food entry not found!";
  }

  //check if date is current date, and if so, update daily calories remaining
  let currentDate = new Date();

  if (
    moment(date).format("YYYY-MM-DD") ==
    moment(currentDate).format("YYYY-MM-DD")
  ) {
    let foodCals = await calculateDailyFoodCalories(id, date);
    let exerciseCals = await calculateDailyExerciseCalories(id, date);
    await userFuncs.calculateDailyCaloriesRemaining(
      id,
      date,
      foodCals,
      exerciseCals
    );

    //updating macros
    let foodsArray = await getFoodsByDate(id, date);
    await userFuncs.calculateDailyMacrosRemaining(id, date, foodsArray);
  }
}
async function calculateDailyFoodCalories(id, currentDate) {
  //1. validations
  if (arguments.length !== 2) throw "Invalid number of arguments";
  validations.stringChecks([id, currentDate]);
  validations.stringtrim(arguments);
  id = validations.checkId(id);
  validations.exerciseFoodLogDateValidation(currentDate);

  //2. check if the user exists
  const usersCollection = await users();
  let user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "User not found!";

  //3. get the food
  let foods = await getFoodsByDate(id, currentDate);
  if (foods.length === 0) return 0; //if there are no foods, then 0 calories were burned

  //4. calculate the total calories burned
  let caloriesEaten = 0;
  foods.forEach((foodObj) => {
    caloriesEaten += foodObj.calories;
  });

  return caloriesEaten;
}

function getRecommendations(calories) {
  //1. validations
  if (arguments.length !== 1) throw "Invalid number of arguments";
  validations.checkCalories2(calories);
  
  //2. get the recommendations
  let foods = [
    {foodName: "Salmon", calories: 208, protein: 20, carbs: 4, fat: 13},
    {foodName: "White Kidney Beans", calories: 77, protein: 5, carbs: 15, fat: 1},
    {foodName: "Lettuce", calories: 26, protein: 2, carbs: 5, fat: 1},
    {foodName: "Lean Beef", calories: 356, protein: 42, carbs: 1, fat: 9},
    {foodName: "Tomato", calories: 36, protein: 2, carbs: 4, fat: 0},
    {foodName: "Kelp", calories: 43, protein: 2, carbs: 10, fat: 1},
    {foodName: "Grapefruit", calories: 33, protein: 1, carbs: 8, fat: 0},
    {foodName: "Cottage Cheese", calories: 98, protein: 11, carbs: 3, fat: 4},
    {foodName: "Lentils", calories: 352, protein: 25, carbs: 64, fat: 1},
    {foodName: "Chicken Breast", calories: 172, protein: 21, carbs: 0, fat: 9},
  ];
  let results = foods.filter(food => (food.calories <= calories));

  return results;
}




async function updateUser(id, firstName, lastName, height, activityLevel, weeklyWeightGoal) {
  if (arguments.length !== 6) throw "Invalid number of arguments"
  id = validations.checkId(id);
  validations.validateUpdateProfile(firstName, lastName, height, activityLevel, weeklyWeightGoal)

  const usersCollection = await users()
  const user = await usersCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw 'Error: User not found';


  let allWeights = await userFuncs.getAllWeights(id);
  let currentWeight = allWeights.weights[allWeights.weights.length - 1];
  
  //update stats
  let dob = (user.dob.getFullYear().toString() + "-" + user.dob.getMonth().toString() + "-" + user.dob.getDate().toString())
  let date = moment(new Date(dob)).format("YYYY-MM-DD")

  let age = nutritionFuncs.calculateAge(date)

  let BMR = nutritionFuncs.calculateBMR(user.gender, height, currentWeight, age)
  let BMI = nutritionFuncs.calculateBMI(height, currentWeight)
  let TDEE = nutritionFuncs.calculateTDE(activityLevel, user.gender, height, currentWeight, age)
  let calsNeeded = nutritionFuncs.calculateCalsNeeded(weeklyWeightGoal, TDEE)

  //update daily cals
  let currentDate = moment().format('YYYY-MM-DD')

  let foodCals = await calculateDailyFoodCalories(id, currentDate);
  let exerciseCals = await calculateDailyExerciseCalories(id, currentDate);

  //set rest of update values
  let firstUpdate = await usersCollection.updateOne(
      {_id: ObjectId(id)},
      {$set: {firstName: firstName, 
          lastName: lastName, 
          height: height, 
          activityLevel: activityLevel, 
          weeklyWeightGoal: weeklyWeightGoal,
          totalDailyCalories: calsNeeded,
          BMR: BMR,
          BMI: BMI}}
  );
  if (firstUpdate === null) throw "error updating user'!";

  await userFuncs.calculateDailyCaloriesRemaining(
    id,
    date,
    foodCals,
    exerciseCals
  );

  return true;
}



async function logCurrentWeight(id, weight, date){
  /**This function is for a user logging their weight at a specified date
   * date must either be the string "current" or a date in YYYY-MM-DD format
   */

 //1. Validate inputs
 if (arguments.length !== 3) throw "Invalid number of arguments"
 validations.stringChecks([date])
 id = validations.checkId(id)
 validations.heightWeightValidation(65, weight)
 if(date !== "current"){
     validations.dateValidation(date)
     date = moment(date).format('YYYY-MM-DD')
 }
 else{
     date = moment().format('YYYY-MM-DD') //if date is "current" then it will be a new date obj at the current time
 }
 
 //2. Establish a connection to the users collection
 const usersCollection = await users() 

 //3. create weight obj
 let currentWeight = {'date': date, 'weight': weight}

 //4. check if weight has been logged for that date
 let user = await usersCollection.findOne({ _id: ObjectId(id) })
 if (user === null) throw "Error! No user with the specified ID is found!" 
 let lastLogged = user.weightEntries[user.weightEntries.length-1]

 if (lastLogged.date === currentWeight.date){ //remove entry for that day
  const remove = await usersCollection.updateOne({ _id: ObjectId(id) }, {$pull: {weightEntries: {date: lastLogged.date}}})

 }

 //5. Query the collection for a user with the specified ID and log weight
 const update = await usersCollection.updateOne({ _id: ObjectId(id) }, {$push: {weightEntries: currentWeight}})
 if (update === null) throw "Error! No user with the specified ID is found!"

 //6. update nutrition info
user = await usersCollection.findOne({ _id: ObjectId(id) })
 await updateUser(id, user.firstName, user.lastName, user.height, user.activityLevel, user.weeklyWeightGoal)

 return true

}





module.exports = {
  addExercise,
  getExercisesByDate,
  removeExercise,
  calculateDailyExerciseCalories,
  addFoodEntry,
  getFoodsByDate,
  removeFoodEntry,
  calculateDailyFoodCalories,
  getRecommendations,
  updateUser,
  logCurrentWeight
};





