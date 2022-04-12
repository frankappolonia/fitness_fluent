const db = require('../config')
const users = db.usersCollection
const bcrypt = require('bcrypt')
const errorHandling = require('../helper')
const validations = errorHandling.userValidations


async function createUser(firstName, lastName, email, password, dob, height, initialWeight, gender, activityLevel, weeklyWeightGoal){
    /**This function is for initital user signup  */

    //1. validate arguments
    if(arguments.length !== 10) throw "Incorrect number of arguments!"
    validations.createUserValidation(firstName, lastName, email, password, dob, height, initialWeight, gender, activityLevel, weeklyWeightGoal)
    validations.stringtrim(arguments)

    //2. establish db connection
    const usersCollection = await users()

    //3. check if email is already in db
    const count = await usersCollection.countDocuments()
    if (count!== 0){ //checks if the email is already in the DB
        const findEmail = await usersCollection.findOne({'email': email.toLowerCase() })
        if (findEmail !== null) throw "Email is already in use!"
    }

    //4. hash the password
    saltRounds = 10
    const hashedPw = await bcrypt.hash(password, saltRounds)

    //5. create new user obj
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        hashedPassword: hashedPw,
        dob: new Date(dob),
        height: height,
        initialWeight: initialWeight,
        gender: gender,
        activityLevel: activityLevel,
        weeklyWeightGoal: weeklyWeightGoal,
        weightEntries: [{'date': Date(), 'weight': initialWeight}],
        allFoods: [],
        allExercises: []
    }
    //6. insert user into the db
    let insertData = await usersCollection.insertOne(newUser)
    if (insertData.acknowldeged === 0 || !insertData.insertedId === 0)
      throw 'Could not add new user!'
}



function calculateBMR(gender, height, weight, age){
    /**Calculation for base metabloic rate (cals needed without accounting for activity level) 
     * Precondition: gender is 'male' or 'female', height is in inches, weight is in lbs
    */
   if (arguments.length !== 4) throw "Invalid number of arguments"
   validations.genderValidation(gender)
   validations.heightWeightValidation(height, weight)
   let BMR;

   if (gender === 'male'){
        BMR = 66 + (6.2 * weight) + (12.7 * height) - (6.76 * age)
   }
   else if (gender === 'female'){
        BMR = 655.1 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
   }
   return BMR

}

function calculateTDE(activityLevel, gender, height, weight, age){
    /**Calculation for total daily energy expenditure (total cals spent each day) */
    if(arguments.length !== 5) throw "Invalid number of arguments!"
    validations.activityLevelValidation(activityLevel)
    let BMR = calculateBMR(gender, height, weight, age)

    let activityLevels = {'sedentary':1.2, 'light':1.375, 'moderate':1.55, 'heavy':1.725, 'hardcore':1.9}
    let TDEE = activityLevels[activityLevel] * BMR
    return TDEE

}

function calculateCalsNeeded(weeklyGoal, TDEE){
    if (arguments.length !== 2) throw "Invaliad number of arguments"
    validations.weeklyGoalValidation(weeklyGoal)

    switch (weeklyGoal){
        case -2: return TDEE - 1000 //lose two pounds per week
        case -1: return TDEE - 500 // lose one pounds per week
        case -0: return TDEE      // maintain current weight per week
        case 1: return TDEE + 500 // gain one pounds per week
        case 2: return TDEE + 1000 // gain two pounds per week
    }

}

module.exports = {
    createUser
}