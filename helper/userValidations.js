let validate = require('email-validator')
/**Validations for creating a user/signup */


function stringtrim(argsObj){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in argsObj){
        if (typeof(argsObj[arg]) === 'string'){
            argsObj[arg] = argsObj[arg].trim()
        }
    } 
}

function stringChecks(args){
    /**Takes an array as an argument, where the array contains the data you want to validate */

    args.forEach(e => {
        if(typeof(e)!== 'string') throw "An argument is not a string!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
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
    let days = Math.abs(currentDay.getTime() - birth.getTime())
    let years = days/(1000 * 3600 * 24)
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

function heightWeightValidation(height, weight){
    if(arguments.length !== 2) throw "invalid number of arguments for heightweight validation"
    if(height !== height || weight !== weight) throw "Height and weight must be numbers!"
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
    if (! gender in genders) throw "Invalid gender"
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

function createUserValidation(firstName, lastName, email, password, dob, height, initialWeight, gender, activityLevel, weeklyWeightGoal){
    /**Wrapper function that calls all of the validation functions for the createUser db function */
    
    if(arguments.length !== 10) throw "Incorrect number of arguments!"
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

    createUserValidation(requestBody.firstName, requestBody.lastName, requestBody.email, requestBody.password,
        requestBody.dob,requestBody.height,requestBody.weight,requestBody.gender,requestBody.activityLevel, requestBody.goal )

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
    username = username.trim()
    let checkEmail = validate.validate(username)
    if (checkEmail === false) throw "Invalid email format!"
    
    username = username.toLowerCase()
    return username
}

function checkPassword(password){
    if (typeof(password) !== 'string') throw "Error! Password must be a string!"
    password = password.trim()
    if(password.search(" ") !== -1) throw "Error! Password cannot contain spaces!"
    if(password.length < 6) throw "Error! Password must be at least 6 characters!"
    return password
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
    dateValidation
}