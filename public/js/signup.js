
//form
let signUp = $('#signup-form')

$('#signup-error').hide()

//signup form validation
signUp.submit((event =>{
    /**This callback funciton gets the values from the signup form, and runs the validations
     * functions on all of them. Prevents default and appends an error to the DOM if 
     * any input checks fail
     */
    let firstName = $('#firstName').val()
    let lastName = $('#lastName').val()
    let email = $('#email').val()
    let password = $('#password').val()
    let passwordCheck = $('#passwordCheck').val()
    let dob = $('#dob').val()

    //health info
    let height = $('#height').val()
    let weight = $('#weight').val()
    let gender = $('select[name=gender] option').filter(':selected').val()
    let activityLevel = $('select[name=activityLevel] option').filter(':selected').val()
    let goal = $('select[name=goal] option').filter(':selected').val()
    let adminCode = $('#adminCode').val()

    try{
        signUpValidation(firstName, lastName, email, password, passwordCheck, dob, height, weight, gender, activityLevel, goal, adminCode)
        $('#email').val(email.toLowerCase())
    }catch(e){
        event.preventDefault()
        $('#signup-error').show()
        $('#signup-error').empty()
        $('#signup-error').append(e)
    }

}));


/**All error checking validations for signup */

function signUpValidation(firstName, lastName, email, password, passwordCheck, dob, height, weight, gender, activityLevel, goal, adminCode){
    /**Validates the request body data of the /signup post route */
    if(! firstName) throw "No first name given!"
    if(! lastName) throw "No last name given!"
    if(! email) throw "No email given!"
    if(! password) throw "No password given!"
    if(! passwordCheck) throw "Must re-enter password!"
    if(! dob) throw "No date of birth given!"
    if(! height) throw "No height given!"
    if(! weight) throw "No weight given!"
    if(! gender) throw "No gender specified!"
    if(! activityLevel) throw "No activty level given!"
    if(! goal) throw "No goal specified!"
    if ( password !== passwordCheck) throw "Passwords do not match!"
    if(! adminCode) throw "No admin goal entered! Must be the correct code, or 0 by default for non-admin users!"

    createUserValidation(firstName, lastName, email, password, passwordCheck, dob, height, weight, gender, activityLevel, goal, adminCode)

    return true
}

function stringtrim(arguments){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in arguments){
        if (typeof(arguments[arg]) === 'string'){
            arguments[arg] = arguments[arg].trim()
        }
    }
    return 
}

function stringChecks(args){
    /**Takes an array as an argument, where the array contains the data you want to validate */
    args.forEach(e => {
        if(!(isNaN(e))) throw "An argument is not a string!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
    return
}

function alphabetCheck(args) {
    var letters = /^[A-Za-z]+$/;
    args.forEach(e => {
        if (!e.match(letters)){
            throw "Invalid characters!"
        }
    })
}

function nameValidation(first, last){
    if (arguments.length !== 2) throw "invalid number of arguments for name validation"

    first = first.trim()
    last = last.trim()
    if (first.length < 2) throw "Firstname must be at least 2 characters!"
    if (last.length < 1) throw "Lastname must be at least 1 character!"
    return
}

function emailPasswordValidation(email, password, passwordCheck){
    if (arguments.length !== 3) throw "invalid number of arguments for client side emailpassword validation"

    email = email.trim()

    if (email.search(/[.]/g) === -1) throw "Invalid domain format, must include '.' puncation!"//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
    if (email.search('@')=== -1) throw "Invalid, must include @"
    if (email.search('@') === 0 || email.search(/[.]/g) === 0) throw "Invalid, cannot have . or @ at the beginning"

    if(! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw "Invalid, cannot have multiple @s"
    if(! /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(email)) throw "Invalid email!"

    let domain = email.slice(email.search('@'))
    function properDotFormat(domain){
        let lastDotIndex = 0
        let count = 0
        for(e of domain){
            if(e === '.'){lastDotIndex = count}
            if (lastDotIndex === 1) throw "Invalid, must have a character after the @"
            count += 1
        }
        if ((domain.length-1) - lastDotIndex < 2) {throw "Invalid format! Must be at least two character after last '.'"}
     
    }
    properDotFormat(domain)
    

    if(password.length<6 || passwordCheck.length <6) throw "Password must be at least 6 characters!"
    return
}

function dobValidation(date){
    /**Checks date. Must be in YYYY-MM-DD format */
    if (arguments.length !== 1) throw "invalid number of arguments for date validation"

    date = date.trim()
    if (date.length !== 10 ) throw "Incorrect date length! Must be YYYY-MM-DD"
    if(date.charAt(4) !== "-" || date.charAt(7) !== '-') throw "Incorrect date format! Must be YYYY-MM-DD"
    function numberCheck(num){
        if(isNaN(num)) throw "Date is not a valid number!"
        if(num%1 !== 0) throw "Date cannot be a decimal!"
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
    
    return

}

function heightWeightValidation(height, weight){
    if(arguments.length !== 2) throw "invalid number of arguments for heightweight validation"
    if(height !== height || weight !== weight) throw "Height and weight must be numbers!"
    if(isNaN(parseInt(height)) || isNaN(parseInt(weight))) throw "Height and weight must be numbers!"
    if(height%1 !== 0 || weight%1 !== 0) throw "Height and weight must be whole numbers!"
    if(weight.search(/e/) !== -1) throw "Invalid number!"
    if(height.search(/e/) !== -1) throw "Invalid number!"
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
    if(!(activity in activityLevels)) throw "Invalid activty level"
    return
}

function genderValidation(gender){
    if (arguments.length !== 1) throw "invalid number of arguments for gender validation"
    gender = gender.trim().toLowerCase()
    let genders = {'male': true, 'female':true}
    if (!(gender in genders)) throw "Invalid gender"
    return
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
    if(isNaN(parseInt(code))) throw "Admin code must be a number!"
    if(code % 1 !== 0) throw "Admin code must be a whole number!"

    code = parseInt(code)
    if (code === 0) return
    else if (code === 1234) return
    else throw "Error! Admin code invalid! You must either enter the corret code, or enter a 0 to be a regular user!"

}

function passwordValidation(password, passwordCheck){
    password = password.trim()
    passwordCheck = passwordCheck.trim()
    if(password.length < 1 || passwordCheck.length < 1) throw "All strings must be at least 1 character!"
}

function createUserValidation(firstName, lastName, email, password, passwordCheck, dob, height, initialWeight, gender, activityLevel, weeklyWeightGoal, adminCode){
    /**Wrapper function that calls all of the validation functions for the createUser db function */
    
    if(arguments.length !== 12) throw "Incorrect number of arguments!"
    //string checks
    stringChecks([firstName, lastName, email, dob, activityLevel, gender])
    alphabetCheck([firstName, lastName, gender, activityLevel])
    stringtrim(arguments)
    //name check
    nameValidation(firstName, lastName)
    //email & password check
    passwordValidation(password, passwordCheck)
    emailPasswordValidation(email, password, passwordCheck)
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
