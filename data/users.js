const db = require('../config')
const users = db.usersCollection
const bcrypt = require('bcrypt')
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const nutritionFuncs = require('./nutritionFunctions')
const { ObjectId } = require('mongodb');

//test comment
/**Database functions for the Users Collection */

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

    //5. Calculate initial nutrition data
    let age = nutritionFuncs.calculateAge(dob)
    let BMR = nutritionFuncs.calculateBMR(gender, height, initialWeight, age)
    let TDEE = nutritionFuncs.calculateTDE(activityLevel, gender, height, initialWeight, age)
    let calsNeeded = nutritionFuncs.calculateCalsNeeded(weeklyWeightGoal, TDEE)

    //6. Create new user obj
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        hashedPassword: hashedPw,
        dob: new Date(dob),
        height: parseFloat(height),
        initialWeight: parseFloat(initialWeight),
        gender: gender,
        activityLevel: activityLevel,
        weeklyWeightGoal: weeklyWeightGoal,
        BMR: BMR,
        TDEE: TDEE,
        totalDailyCalories: calsNeeded,
        dailyCaloriesRemaining: calsNeeded,
        weightEntries: [{'date': new Date(), 'weight': initialWeight}],
        allFoods: [],
        allExercises: []
    }
    
    //7. insert user into the db
    let insertData = await usersCollection.insertOne(newUser)
    if (insertData.acknowldeged === 0 || !insertData.insertedId === 0)
      throw 'Could not add new user!'
    
    //8. get user id
    let user = await usersCollection.findOne({email: email.toLowerCase()})
    return user['_id'].toString()
}

async function checkUser(username, password){
    /**This function is for validating login */

    //1. validate inputs
    if (arguments.length !== 2) throw "Error! Incorrect number of arguments given!"
    username = validations.checkUsername(username)
    password = validations.checkPassword(password)

    //2. establish db connection
    const usersCollection = await users()

    //3. check if username exists
    const user = await usersCollection.findOne({'email': username })
    if (user === null) throw "Either the username or password is invalid"

    //4. check if password is same
    const pwCheck = await bcrypt.compare(password, user['hashedPassword'] )
    if(pwCheck === false) throw "Either the username or password is invalid"

    let id = user['_id'].toString()
    let auth = {userId: id, authenticated: true}
    return auth
}

async function getUserById(id) {
    /**This function is for getting a user by their ObjectID */

    //1. validate
    if(arguments.length!== 1) throw "invalid number of arguments!"
    validations.stringChecks([id])
    id = validations.checkId(id)

    //2. establish connection to db
    const userCollection = await users();

    //3. query db for user
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (!user) throw 'Error: User not found';

    //4. return the user
    return user;
  }

async function getRemainingCalories(id){
    /**This function gets the remaining calories left in the day for the user 
      */

    //1. Validate inputs
    if (arguments.length !== 1) throw "Invalid number of arguments"
    id = validations.checkId(id)
    
    //2. Establish a connection to the users collection
    const usersCollection = await users() 

    //3. Query the collection for a user with the specified ID
    const user = await usersCollection.findOne({ _id: ObjectId(id) })
    if (user === null) throw "Error! No user with the specified ID is found!"

    //4. Extract the daily remaining calories
    let remainingCals = user['dailyCaloriesRemaining']
    return remainingCals;
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
        date = new Date(date)
    }
    else{
        date = Date() //if date is "current" then it will be a new date obj at the current time
    }
    
    //2. Establish a connection to the users collection
    const usersCollection = await users() 

    //3. create weight obj
    let currentWeight = {'date': date, 'weight': weight}

    //4. Query the collection for a user with the specified ID
    const user = await usersCollection.updateOne({ _id: ObjectId(id) }, {$push: {weightEntries: currentWeight}})
    if (user === null) throw "Error! No user with the specified ID is found!"

    return true

}

async function getWeights(id, startDate, endDate){
    /**This function returns an object all of the weights a user logged within a specified date range 
     * (startDate & endDate)
     */

    //1. Validate inputs
    if (arguments.length !== 3) throw "Invalid number of arguments"
    validations.stringChecks([startDate, endDate])
    validations.stringtrim(arguments)
    id = validations.checkId(id)
    validations.dateValidation(startDate)
    validations.dateValidation(endDate)
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    if (startDate.getTime() > endDate.getTime()) throw "Start date can't be before end date!"


     //2. Establish a connection to the users collection
     const usersCollection = await users() 

    //3. Query the collection for a user with the specified ID
    const user = await usersCollection.findOne({ _id: ObjectId(id) })
    if (user === null) throw "Error! No user with the specified ID is found!"

    //4. Get weight info
    let data = {
        weights: [], 
        dates: []
    }

    user['weightEntries'].forEach(entry => {
        /**this loops through each weight entry object the user has in the db, and sees if it falls between
         * the start and end dates specified. if itdoes, pushes the weight & date to the data object
         */
        if(entry.date.getTime() >= startDate.getTime() && entry.date.getTime() <= endDate.getTime()){
            data.dates.push(entry.date)
            data.weights.push(entry.weight)
        }
    });

    return data
}

async function getAllWeights(id){
    /**This function returns an object all of the weights a user logged from all time
     * (startDate & endDate)
     */

    //1. Validate inputs
    if (arguments.length !== 1) throw "Invalid number of arguments"
    id = validations.checkId(id)
   
     //2. Establish a connection to the users collection
     const usersCollection = await users() 

    //3. Query the collection for a user with the specified ID
    const user = await usersCollection.findOne({ _id: ObjectId(id) })
    if (user === null) throw "Error! No user with the specified ID is found!"

    //4. Get weight info
    let data = {
        weights: [], 
        dates: []
    }

    user['weightEntries'].forEach(entry => {
        data.dates.push(entry.date)
        data.weights.push(entry.weight)
        
    });
    
    return data
}

async function getOverallWeightProgress(id){
    /**This function calculates the total weight gained or lost by the user from their 
     * starting weight, to their current weight
     */
    //1. validate args
    if (arguments.length !== 1) throw "Invalid number of arguments"
    id = validations.checkId(id)

    //2. get data
    let data = await getAllWeights(id)
    let weights = data.weights

    //3. process data
    let startingWeight = weights[0]
    let endingWeight = weights[weights.length-1]
    let result = {
                weight: Math.abs(startingWeight-endingWeight),
                weightChange: ""
                }
    if(startingWeight < endingWeight)
        result.weightChange = "gained"
    else if(startingWeight > endingWeight)
        result.weightChange = "lost"  
    else if(startingWeight === endingWeight)
        result.weightChange = "maintained"
    
    return result
}




module.exports = {
    createUser,
    checkUser,
    getUserById,
    getRemainingCalories,
    logCurrentWeight,
    getWeights,
    getAllWeights,
    getOverallWeightProgress
}