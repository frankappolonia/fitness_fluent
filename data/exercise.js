const { usersCollection } = require('../config')
const db = require('../config')
const users = db.usersCollection
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const exerciseFuncs = require('./exerciseFunctions')

async function addExercise(name, calories)
{
    if(arguments.length!==2){
        throw "Incorrect number of arguments!"
    }
    validations.checkExercise(name);
    validations.checkCalories(calories);
    const usersCollection = await users()
    const currUser = usersCollection.findOne
}

