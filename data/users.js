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
        const findEmail = await usersCollection.findOne({'email': email })
        if (findEmail !== null) throw "Email is already in use!"
    }

    //4. hash the password
    saltRounds = 10
    const hashedPw = await bcrypt.hash(password, saltRounds)

    //5. create new user obj
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
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

module.exports = {
    createUser
}