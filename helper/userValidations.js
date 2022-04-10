const { type } = require("os");

function stringtrim(arguments){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in arguments){
        if (typeof(arguments[arg]) === 'string'){
            arguments[arg] = arguments[arg].trim()
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
    if (first.length < 2) throw "Firstname must be at least 2 characters!"
    if (last.length < 1) throw "Lastname must be at least 1 character!"
}

function emailPasswordValidation(email, password){
    if(email.search("@") === -1) throw "Invalid email!"
    if(email.search('.')===-1) throw "Invalid email!"
    if(password.length<6) throw "Password must be at least 6 characters!"
}

function dobValidation(date){
    /**Checks date. Must be in MM/DD/YYYY format */
    date = date.trim()
    if (date.length !== 10 ) throw "Incorrect date length!"
    if(date.charAt(2) !== "/" || date.charAt(5) !== '/') throw "Incorrect date format!"
    function numberCheck(num){
        if(isNaN(num)) throw "Date is not a valid number!"
        if(num%1 !== 0) throw "Date cannot be a decimal ID!"
        return num
    }
    const monthKey = {'1':31, '2':28, '3':31, '4':30, '5':31, '6':30, 
    '7':31, '8':31, '9':30, '10':31, '11':30, '12':31}
    let month = parseInt(numberCheck(date.slice(0, 2)))
    let day = parseInt(numberCheck(date.slice(3, 5)))
    let year = parseInt(numberCheck(date.slice(6)))
    if (month < 1 || month > 12) throw "Invalid month!"
    if (year < 1900 || year > 2022) throw "Invalid year"
    if(day > monthKey[month] || day < 1){throw "Invalid day!"}

}

function heightWeightValidation(height, weight){
    if(height !== height || weight !== weight) throw "Height and weight must be numbers!"
    if(isNaN(height) || isNaN(weight)) throw "Height and weight must be numbers!"
    if(typeof(height) !== 'number' || typeof(weight) !== 'number') throw "Height and weight must be numbers!"
    
    if (height < 21) throw "Must be at least 21 inches tall!"
    if (height > 107) throw "You're not that tall!"
    if (weight < 5) throw "You must weigh at least 5 pounds!"
    if (weight > 1400) throw "You're not that heavy!"
}

function activityLevelValidation(activity){
    let activityLevels = {'sedentary':1.2, 'light':1.375, 'moderate':1.55, 'heavy':1.725, 'hardcore':1.9}
    if(! activity in activityLevels) throw "Invalid activty level"
}

function genderValidation(gender){
    let genders = {'male': true, 'female':true}
    if (! gender in genders) throw "Invalid gender"
}

function weeklyGoalValidation(goal){
    /**Weekly weight loss/gain goal must be no more than + or - 2 pounds */
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
    createUserValidation
}