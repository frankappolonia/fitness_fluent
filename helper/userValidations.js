let validate = require('email-validator');
const { request } = require('express');
const { type } = require('express/lib/response');
const { ObjectId } = require('mongodb');
/**Validations for creating a user/signup */


function stringtrim(argsObj){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in argsObj){
        if (typeof(argsObj[arg]) === 'string'){
            argsObj[arg] = argsObj[arg].trim()
        }
    } 
}

function stringChecks(strings){
    /**Takes an array as an argument, where the array contains the data you want to validate */
    strings.forEach(e => {
        if(typeof(e)!== 'string') throw "An argument is not a string!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
}

function checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
      throw 'Error: id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
  }

function nameValidation(first, last){
    if (arguments.length !== 2) throw "invalid number of arguments for name validation"

    first = first.trim()
    last = last.trim()
    if (first.length < 2) throw "Firstname must be at least 2 characters!"
    if (last.length < 1) throw "Lastname must be at least 1 character!"
}

function emailPasswordValidation(email, password){
    if (arguments.length !== 2) throw "invalid number of arguments for emailpassword validation"

    email = email.trim()
    let checkEmail = validate.validate(email)
    if (checkEmail === false) throw "Invalid email format!"
    if(password.length<6) throw "Password must be at least 6 characters!"
}

function dobValidation(date){
    /**Checks date. Must be in YYYY-MM-DD format */
    if (arguments.length !== 1) throw "invalid number of arguments for date validation"

    date = date.trim()
    if (date.length !== 10 ) throw "Incorrect date length!"
    if(date.charAt(4) !== "-" || date.charAt(7) !== '-') throw "Incorrect date format!"
    function numberCheck(num){
        if(isNaN(num)) throw "Date is not a valid number!"
        if(num%1 !== 0) throw "Date cannot be a decimal ID!"
        return num
    }
    const monthKey = {'1':31, '2':28, '3':31, '4':30, '5':31, '6':30, 
    '7':31, '8':31, '9':30, '10':31, '11':30, '12':31}
    let month = parseInt(numberCheck(date.slice(5, 7)))
    let day = parseInt(numberCheck(date.slice(8)))
    let year = parseInt(numberCheck(date.slice(0,4)))
    if (month < 1 || month > 12) throw "Invalid month!"
    if (year < 1900 || year > 2022) throw "Invalid year"
    if(day > monthKey[month] || day < 1){throw "Invalid day!"}

    let currentDay = new Date()
    let birth = new Date(date)
    let years = Math.abs(currentDay.getTime() - birth.getTime())/1000/60/60/24/365
    if (years < 12) throw "Must be at least 12 years old to signup!"
   

}

function dateValidation(date){
       /**Checks date. Must be in YYYY-MM-DD format */
       if (arguments.length !== 1) throw "invalid number of arguments for date validation"

       date = date.trim()
       if (date.length !== 10 ) throw "Incorrect date length!"
       if(date.charAt(4) !== "-" || date.charAt(7) !== '-') throw "Incorrect date format!"
       function numberCheck(num){
           if(isNaN(num)) throw "Date is not a valid number!"
           if(num%1 !== 0) throw "Date cannot be a decimal ID!"
           return num
       }
       const monthKey = {'1':31, '2':28, '3':31, '4':30, '5':31, '6':30, 
       '7':31, '8':31, '9':30, '10':31, '11':30, '12':31}
       let month = parseInt(numberCheck(date.slice(5, 7)))
       let day = parseInt(numberCheck(date.slice(8)))
       let year = parseInt(numberCheck(date.slice(0,4)))
       if (month < 1 || month > 12) throw "Invalid month!"
       if (year < 1900 || year > 2022) throw "Invalid year"
       if(day > monthKey[month] || day < 1){throw "Invalid day!"}
   
}

function exerciseFoodLogDateValidation(date){
    //first checks if its a valid date
    dateValidation(date)
    date = new Date(date)
    if(date.getTime() > new Date().getTime()) throw "Cannot add entry later than the current date!"
}

function heightWeightValidation(height, weight){
    if(arguments.length !== 2) throw "invalid number of arguments for heightweight validation"
    if(height !== height || weight !== weight) throw "Height and weight must be numbers!"
    if(isNaN(height) || isNaN(weight)) throw "Height and weight must be numbers!"
    if(isNaN(parseInt(height)) || isNaN(parseInt(weight))) throw "Height and weight must be numbers!"
    if(height%1 !== 0 || weight%1 !== 0) throw "Height and weight must be whole numbers!"
    height = parseInt(height)
    weight = parseInt(weight)
    if(typeof(height) !== 'number' || typeof(weight) !== 'number') throw "Height and weight must be numbers!"
    if (height < 21) throw "Must be at least 21 inches tall!"
    if (height > 107) throw "You're not that tall!"
    if (weight < 5) throw "You must weigh at least 5 pounds!"
    if (weight > 1400) throw "You're not that heavy!"

}

function activityLevelValidation(activity){
    if (arguments.length !== 1) throw "invalid number of arguments for activity validation"
    activity = activity.trim().toLowerCase()
    let activityLevels = {'sedentary':1.2, 'light':1.375, 'moderate':1.55, 'heavy':1.725, 'hardcore':1.9}
    if(!(activity in activityLevels)) throw "Invalid activty level, nice try professor hill!"
}

function genderValidation(gender){
    if (arguments.length !== 1) throw "invalid number of arguments for gender validation"
    gender = gender.trim().toLowerCase()
    let genders = {'male': true, 'female':true}
    if (!(gender in genders)) throw "Invalid gender"
}

function weeklyGoalValidation(goal){
    /**Weekly weight loss/gain goal must be no more than + or - 2 pounds */
    if (arguments.length !== 1) throw "invalid number of arguments for goal validation"

    if(goal !== goal) throw "Goal is NaN"
    if(isNaN(parseInt(goal))) throw "Goal must be a number!"
    if(goal%1) throw "goal be a whole number!"
    goal = parseInt(goal)
    if(typeof(goal) !== 'number') throw "Goal must be a number!"
    
    if(goal > 2 || goal < -2) throw "Can only gain or lose up to a max of 2 pounds per week"
    if(goal % 1 !== 0) throw "Must be a whole number!"

}

function adminCodeValidation(code){
    if(arguments.length !== 1) throw "Invalid number of arguments"
    if(code !== code) throw "Admin code must be a number"
    if(isNaN(parseInt(code))) throw "Admin code must be a number"
    if(code % 1 !== 0) throw "Admin code must be a whole number!"
    code = parseInt(code)
    if(typeof(code) !== 'number') throw "Admin code must be a number!"

    if (code === 0) return
    else if (code === 1234) return
    else throw "Error! Admin code invalid! You must either enter the corret code, or enter a 0 to be a regular user!"

}

function createUserValidation(firstName, lastName, email, password, dob, height, initialWeight, gender, activityLevel, weeklyWeightGoal, adminCode){
    /**Wrapper function that calls all of the validation functions for the createUser db function */
    
    if(arguments.length !== 11) throw "Incorrect number of arguments!"
    //string checks
    stringChecks([firstName, lastName, email, password, dob, activityLevel, gender])

    stringtrim(arguments)
    //name check
    nameValidation(firstName, lastName)
    //email & password check
    emailPasswordValidation(email, password)
    //dob check
    dobValidation(dob)
    //height and weight check
    heightWeightValidation(height, initialWeight)
    //gender check
    genderValidation(gender)
    //activity level check
    activityLevelValidation(activityLevel)
    //weekly weight goal check
    weeklyGoalValidation(weeklyWeightGoal)

    adminCodeValidation(adminCode)
    return
}


function signUpRouteValidation(requestBody){
    /**Wrapper function that Validates the request body data of the /signup post route */
    if(! requestBody.firstName) throw "No first name given!"
    if(! requestBody.lastName) throw "No last name given!"
    if(! requestBody.email) throw "No email given!"
    if(! requestBody.password) throw "No password given!"
    if(! requestBody.passwordCheck) throw "Must re-enter password!"
    if(! requestBody.dob) throw "No date of birth given!"
    if(! requestBody.height) throw "No height given!"
    if(! requestBody.weight) throw "No weight given!"
    if(! requestBody.gender) throw "No gender specified!"
    if(! requestBody.activityLevel) throw "No activty level given!"
    if(! requestBody.goal) throw "No goal specified!"
    if (requestBody.password !== requestBody.passwordCheck) throw "Passwords do not match!"
    if(! requestBody.adminCode) throw "Must either enter the admin code, or a 0 for regular users!"

    createUserValidation(requestBody.firstName, requestBody.lastName, requestBody.email, requestBody.password,
        requestBody.dob,requestBody.height,requestBody.weight,requestBody.gender,requestBody.activityLevel, requestBody.goal, requestBody.adminCode )

}

function checkRequestBody(req){
    if (! req.body.username){
        return false
    }
    if (! req.body.password){
        return false
    }
    return true
}

function checkUsername(username){
    if(typeof(username) !== 'string') throw "Error! Username must be a string!"
    stringChecks([username])
    username = username.trim()
    let checkEmail = validate.validate(username)
    if (checkEmail === false) throw "Invalid email format!"
    
    username = username.toLowerCase()
    return username
}

function checkPassword(password){
    if (typeof(password) !== 'string') throw "Error! Password must be a string!"
    stringChecks([password])
    password = password.trim()
    if(password.search(" ") !== -1) throw "Error! Password cannot contain spaces!"
    if(password.length < 6) throw "Error! Password must be at least 6 characters!"
    return password
}

function progressRouteValidation(requestBody){
    if(! requestBody.start) throw "No start date given!"
    if(! requestBody.end) throw "No end date given!"
    stringChecks([requestBody.start, requestBody.end])
    dateValidation(requestBody.start.trim())
    dateValidation(requestBody.end.trim())

    let startDate = new Date(requestBody.start.trim()).getTime()
    let endDate = new Date(requestBody.end.trim()).getTime()
    if (startDate > endDate) throw "Start date can't be before end date!"
}


function checkCalories(calories){
    if(arguments.length !== 1) throw "Invalid number of arguments!"
    if(calories !== calories) throw "Calories is not a number!"
    if(isNaN(parseInt(calories))) throw "Calories is not a number!"
    calories = parseInt(calories)
    if(typeof(calories) !== 'number') throw "Calories must be a number!"
    if(calories%1 !== 0) throw "Calories must be a whole number!"
    if(calories < 1) throw "Calories must be a number greater than 1!"
    if(calories > 2000) throw "Maximum calorie value is 2000!"
}

function exercisePostRouteValidation(requestBody){
    if(! requestBody.date) throw "No date given!"
    if(! requestBody.exercise) throw "No exercise given!"
    if(! requestBody.calories) throw "No calories given!"

    let { date, exercise, calories } = requestBody;

    stringChecks([date, exercise])
    stringtrim(arguments)
    checkCalories(calories)
    exerciseFoodLogDateValidation(date)

}

function deleteFoodExerciseRouteValidation(requestBody){
    if(! requestBody.exerciseName) throw "No exercise given!"
    if(! requestBody.calories) throw "No calories given!"
    let {exerciseName, calories } = requestBody;
    stringChecks([exerciseName])
    checkCalories(calories)
}

module.exports = {
    stringtrim,
    stringChecks,
    nameValidation,
    emailPasswordValidation,
    dobValidation,
    heightWeightValidation,
    activityLevelValidation,
    genderValidation,
    weeklyGoalValidation,
    createUserValidation,
    signUpRouteValidation,
    checkRequestBody,
    checkPassword,
    checkUsername,
    dateValidation,
    progressRouteValidation,
    checkId,
    checkCalories,
    exerciseFoodLogDateValidation,
    exercisePostRouteValidation,
    deleteFoodExerciseRouteValidation
}